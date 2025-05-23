/**
 * Appointment Occurrences Sliding Window Generator
 *
 * This serverless function maintains a 6-month sliding window of appointment occurrences in the database.
 * It performs two main operations:
 * 1. Cleans up old appointment occurrences (older than 6 months)
 * 2. Generates future appointment occurrences for the next 6 months based on:
 *    - One-time appointments that fall within the window
 *    - Recurring appointments based on iCalendar RRULEs
 *
 * The function is designed to be run periodically to maintain an up-to-date window of appointments.
 */

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import rulePkg from "npm:rrule@2.8.1";
const { rrulestr } = rulePkg;
import parsePgInterval from "npm:postgres-interval";

// ─── Supabase Client Setup (set Supabase credentials as environment secrets)────────────────────
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

/**
 * Convert a Postgres interval string into total milliseconds.
 * Uses postgres-interval to parse, then approximates:
 *  • 1 year == 365 days
 *  • 1 month == 30 days
 *
 * @param {string | null} interval - PostgreSQL interval string (e.g., '2 days 4 hours')
 * @returns {number | null} - Total milliseconds or null if no interval provided
 */
function parseInterval(interval) {
  if (!interval) {
    return null;
  }
  // parsePgInterval returns an object like { years, months, days, hours, minutes, seconds, milliseconds }
  const {
    years = 0,
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
    milliseconds = 0,
  } = parsePgInterval(interval);
  // If you need weeks too (rare in default style), PostgreSQL will expand them into days.
  // Now combine everything:
  const totalDays = years * 365 + months * 30 + days;
  const totalMs =
    ((totalDays * 24 + hours) * 3600 + minutes * 60 + seconds) * 1000 +
    milliseconds;
  return totalMs;
}

/**
 * Formats a Date object according to a specified timezone using Intl.DateTimeFormat.
 *
 * This function converts and formats a JavaScript Date object to a string representing
 * the local time in the specified timezone. It returns a consistent format of:
 * "MM/DD/YYYY, HH:MM:SS" (24-hour format)
 *
 * @param {Date} date - The JavaScript Date object to format
 * @param {string} timezone - IANA timezone identifier (e.g., "America/New_York", "Europe/London", "Asia/Tokyo")
 * @returns {string} A formatted string representation of the date in the specified timezone
 *
 * @example
 * // Format a date in New York timezone
 * const nyTime = getLocalTimeInTimezone(new Date('2023-05-15T12:30:00Z'), 'America/New_York');
 * // Returns "05/15/2023, 08:30:00" (assuming EDT is in effect)
 *
 * @example
 * // Format the same date in Tokyo timezone
 * const tokyoTime = getLocalTimeInTimezone(new Date('2023-05-15T12:30:00Z'), 'Asia/Tokyo');
 * // Returns "05/15/2023, 21:30:00"
 *
 * @note This function uses the browser's Intl.DateTimeFormat API, which respects
 * daylight saving time and other timezone rules for the specified timezone
 */
function getLocalTimeInTimezone(date: Date, timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Main serverless function handler that processes HTTP requests.
 * Manages the sliding window of appointment occurrences.
 */
Deno.serve(async (req) => {
  try {
    // === PHASE 1: CLEANUP ===
    // Remove appointment occurrences that are older than 6 months
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set time to midnight for consistency
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const { error: deleteError } = await supabase
      .from("appointment_occurrences")
      .delete()
      .lt("due_dt", sixMonthsAgo.toISOString());
    if (deleteError) {
      console.error("Error deleting old appointment recurrences:", deleteError);
      throw deleteError;
    }

    // === PHASE 2: DATA RETRIEVAL ===
    // Get all task_appointments to generate occurrences
    const { data, error } = await supabase
      .from("task_appointments")
      .select("id, start_due_dt, availability_window, rrule");
    if (error) {
      throw error;
    }

    // Create array of records to insert
    var recordsToInsert: {
      task_appointment_id: string;
      due_dt: string;
      open_dt: string | null;
    }[] = [];

    // === PHASE 3: OCCURRENCE GENERATION ===
    // Iterate over each task_appointment to generate occurrences
    for (const appt of data) {
      const { id, start_due_dt, availability_window, rrule, timezone_id } =
        appt;

      // Parse the appointment's start date
      const startDueDt = new Date(start_due_dt);
      if (isNaN(startDueDt.getTime())) {
        throw new Error(`Invalid due_dt : ${start_due_dt}`);
      }

      // Get the local representation of startDueDt in the appointment's timezone
      const localStartDueDt = new Date(getLocalTimeInTimezone(startDueDt, timezone_id));

      // Define the 6-month window for future occurrences
      const sixMonthsLater = new Date(now);
      sixMonthsLater.setMonth(now.getMonth() + 6);

      // Get the start date and time by decrementing 1 day from six months later
      // This creates a 1-day buffer to ensure we don't miss any occurrences
      const startDateTime = new Date(sixMonthsLater);
      startDateTime.setDate(startDateTime.getDate() - 1);

      // Increment one second to ensure the six months later date is included in range comparisons
      sixMonthsLater.setSeconds(sixMonthsLater.getSeconds() + 1);

      // Parse the availability window (time before due_dt when the task becomes available)
      const offsetMs = parseInterval(availability_window);

      // === HANDLE ONE-TIME APPOINTMENTS ===
      // If the task's due date is in our target window, add it to the occurrences
      if (startDueDt > startDateTime && startDueDt <= sixMonthsLater) {
        recordsToInsert.push({
          task_appointment_id: id,
          due_dt: startDueDt.toISOString(),
          open_dt:
            offsetMs === null
              ? null
              : new Date(startDueDt.getTime() - offsetMs).toISOString(), // UTC ISO format
        });
      }

      // === HANDLE RECURRING APPOINTMENTS ===
      // If rrule is not null, parse it and generate recurring occurrences
      if (rrule) {
        // Parse the RRULE string with dtstart = base datetime
        const rule = rrulestr(rrule, {
          dtstart: localStartDueDt,
            tzid: timezone_id, // Set the timezone ID for the appointment
        });

        // Generate occurrences in the range of later of startDueDt or startDateTime to sixMonthsLater
        const effectiveStartDate = startDueDt > startDateTime ? startDueDt : startDateTime;
        const occurrences = rule.between(effectiveStartDate, sixMonthsLater);

        if (offsetMs === null) {
          // No availability window - tasks are immediately available
          occurrences.forEach((date) => {
            recordsToInsert.push({
              task_appointment_id: id,
              due_dt: date.toISOString(),
              open_dt: null,
            });
          });
        } else {
          // Calculate when each occurrence becomes available based on availability window
          occurrences.forEach((date) => {
            recordsToInsert.push({
              task_appointment_id: id,
              due_dt: date.toISOString(), // UTC ISO format (Supabase uses timestamptz),
              open_dt: new Date(date.getTime() - offsetMs).toISOString(), // UTC ISO format
            });
          });
        }
      }
    }

    // === PHASE 4: DATABASE UPDATE ===
    // Insert all generated occurrences in a single batch operation
    if (recordsToInsert.length > 0) {
      const { error } = await supabase
        .from("appointment_occurrences")
        .insert(recordsToInsert);
      if (error) {
        console.error("Batch insert error:", error);
      }
    }

    // Return success response with count of inserted records
    return new Response(
      JSON.stringify({
        inserted: recordsToInsert.length,
      }),
      {
        status: 200,
      }
    );
  } catch (err) {
    // Handle and return errors with appropriate status code
    return new Response(
      JSON.stringify({
        message: err?.message ?? err,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 500,
      }
    );
  }
});
