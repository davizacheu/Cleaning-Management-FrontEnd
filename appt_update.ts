/**
 * Appointment Update Webhook Handler
 * 
 * This serverless function processes webhook events from Supabase
 * when task appointments are inserted or updated in the database.
 * It automatically generates or regenerates future appointment occurrences
 * based on the appointment's schedule rules (iCalendar RRULE) and parameters.
 * 
 * The function maintains a 6-month window of future appointment occurrences,
 * allowing the application to display upcoming appointments without
 * storing the entire indefinite sequence of recurring appointments.
 */

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import rulePkg from 'npm:rrule@2.8.1';
const { rrulestr } = rulePkg
import parsePgInterval from 'npm:postgres-interval';

// ─── Payload Interface ─────────────────────────────────────────────────────────
/**
 * Type definition for the webhook payload received from Supabase
 * Contains information about the database change event and affected records
 */
interface WebhookPayload {
  /** Database operation type: "INSERT" | "UPDATE" | "DELETE" | etc. */
  type: string;
  /** Database schema name, e.g. "public" */
  schema: string;
  /** Database table name, e.g. "task_appointments" */
  table: string;
  /** The new row data after INSERT or UPDATE operation */
  record: {
    id: string;
    start_due_dt: string;             // ISO formatted date-time string
    availability_window: string | null; // Postgres interval text (e.g. "2 days")
    rrule: string | null;             // iCal RRULE format or null for one-time appointments
    updated_at: string;               // ISO formatted date-time when record was last updated
    timezone_id: string;             // Timezone ID for the appointment
  };
  /** The previous row data before UPDATE (undefined on INSERT operations) */
  old_record?: {
    id: string;
    rrule?: string | null;
    due_time?: string;
    availability_window?: string | null;
  };
}

// ─── Supabase Client Setup (set Supabase credentials as environment secrets)────────────────────
/**
 * Initialize Supabase client with service role permissions
 * Service role is needed to directly write to database tables
 */
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
function parseInterval(interval: string | null): number | null {
  if (!interval) {
    return null;
  }
  // parsePgInterval returns an object like { years, months, days, hours, minutes, seconds, milliseconds }
  const { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0 } = parsePgInterval(interval);
  // If you need weeks too (rare in default style), PostgreSQL will expand them into days.
  // Now combine everything:
  const totalDays = years * 365 + months * 30 + days;
  const totalMs = ((totalDays * 24 + hours) * 3600 + minutes * 60 + seconds) * 1000 + milliseconds;
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
  return new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(date);
}

// ─── Edge Function ────────────────────────────────────────────────────────────
/**
 * Main webhook handler function that processes database change events
 * Generates appointment occurrences based on appointment rules and settings
 */
Deno.serve(async (req) => {
  try {
    // Parse the webhook payload from the request body
    const { type, table, schema, record }: WebhookPayload = await req.json();

    // Filter webhook events - only process INSERT or UPDATE operations on task_appointments table
    if (schema !== "public" || table !== "task_appointments" || type !== "INSERT" && type !== "UPDATE") {
      // Respond with 204 No Content for events we don't need to process
      return new Response(null, {
        status: 204
      });
    }

    // Extract relevant fields from the appointment record
    const { id, start_due_dt, availability_window, rrule, updated_at, timezone_id } = record;

    // For UPDATE events, remove any future occurrences that would be recalculated
    // This prevents duplicate occurrences and ensures consistency with new settings
    if (type === 'UPDATE') {
      await supabase
        .from('appointment_occurrences')
        .delete()
        .eq('task_appointment_id', id)
        .gt('due_dt', updated_at);
    }

    // Parse the appointment's start date
    const startDueDt = new Date(start_due_dt);
    if (isNaN(startDueDt.getTime())) {
      throw new Error(`Invalid due_dt : ${start_due_dt}`);
    }

    // Get the local representation of startDueDt in the appointment's timezone
    const localStartDueDt = new Date(getLocalTimeInTimezone(startDueDt, timezone_id));

    // Calculate the 6-month window for generating occurrences
    // This limits how far into the future we generate occurrences
    const updateDt = new Date(updated_at);
    const sixMonthsLater = new Date(updateDt);
    sixMonthsLater.setMonth(updateDt.getMonth() + 6);

    // Set the time to midnight UTC - normalizing the end boundary
    sixMonthsLater.setHours(0, 0, 0, 0);
    sixMonthsLater.setSeconds(sixMonthsLater.getSeconds() + 1);

    // Parse availability window - the time before due_dt when a task becomes available
    const offsetMs = parseInterval(availability_window);

    // Create array of records to insert
    var recordsToInsert: { task_appointment_id: string; due_dt: string; open_dt: string | null; }[] = [];

    // Process one-time appointments
    // If the appointment's due date falls within our window, add it to occurrences
    if (startDueDt > updateDt && startDueDt <= sixMonthsLater) {
      recordsToInsert.push({
        task_appointment_id: id,
        due_dt: startDueDt.toISOString(),
        open_dt: offsetMs === null ? null : new Date(startDueDt.getTime() - offsetMs).toISOString() // UTC ISO format
      });
    }

    // Process recurring appointments based on iCalendar RRULE
    if (rrule) {
      // Parse the RRULE string using the rrule library, setting the start date
      const rule = rrulestr(rrule, {
        dtstart: localStartDueDt,
        tzid: timezone_id // Set the timezone ID for the appointment
      });

      // Generate occurrences from the later of startDueDt or updateDt
      const effectiveStartDate = startDueDt > updateDt ? startDueDt : updateDt;
      const occurrences = rule.between(effectiveStartDate, sixMonthsLater);

      if (offsetMs === null) {
        // No availability window - tasks are immediately available
        occurrences.forEach(date => {
          recordsToInsert.push({
            task_appointment_id: id,
            due_dt: date.toISOString(),
            open_dt: null
          });
        });
      } else {
        // Calculate when each occurrence becomes available based on availability window
        occurrences.forEach(date => {
          recordsToInsert.push({
            task_appointment_id: id,
            due_dt: date.toISOString(), // UTC ISO format (Supabase uses timestamptz),
            open_dt: new Date(date.getTime() - offsetMs).toISOString() // UTC ISO format
          });
        });
      }
    }

    // Insert all generated occurrences in a single batch operation
    if (recordsToInsert.length > 0) {
      const { error } = await supabase
        .from('appointment_occurrences')
        .insert(recordsToInsert);

      if (error) {
        console.error('Batch insert error:', error);
      }
    }

    // Return success response with count of inserted records
    return new Response(JSON.stringify({
      inserted: recordsToInsert.length
    }), {
      status: 200
    });

  } catch (err) {
    // Log and return any errors that occur during processing
    console.error('Edge function error:', err);
    return new Response(`Error: ${err.message}`, {
      status: 500
    });
  }
});
