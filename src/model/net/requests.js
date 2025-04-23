// src/models/requests.js

/**
 * ===========================
 * Authentication Requests
 * ===========================
 */

/**
 * Login request class
 */
export class LoginRequest {
  /**
   * @param {string} username - User's username
   * @param {string} password - User's password
   */
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }


  /**
   * Creates a LoginRequest instance
   * @param {string} username - User's username
   * @param {string} password - User's password
   * @returns {LoginRequest} A new instance of LoginRequest
   */
  static create(username, password) {
    return new LoginRequest(username, password);
  }
}

/**
 * Password reset request class
 */
export class PasswordResetRequest {
  /**
   * @param {string} email - User's email address
   */
  constructor(email) {
    this.email = email;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      email: this.email
    };
  }
}

/**
 * Password update request class
 */
export class PasswordUpdateRequest {
  /**
   * @param {string} token - Reset token from email
   * @param {string} newPassword - New password
   */
  constructor(token, newPassword) {
    this.token = token;
    this.newPassword = newPassword;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      token: this.token,
      newPassword: this.newPassword
    };
  }
}

/**
 * ===========================
 * User Requests
 * ===========================
 */

/**
 * User profile request class
 */
export class UserProfileRequest {
  /**
   * @param {string} userId - ID of the user to fetch
   */
  constructor(userId) {
    this.userId = userId;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      userId: this.userId
    };
  }
}

/**
 * User update request class
 */
export class UserUpdateRequest {
  /**
   * @param {string} userId - User ID to update
   * @param {Object} userData - User data to update
   */
  constructor(userId, userData) {
    this.userId = userId;
    this.userData = userData;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      userId: this.userId,
      ...this.userData
    };
  }
}

/**
 * ===========================
 * Company Requests
 * ===========================
 */

/**
 * Company details request class
 */
export class CompanyRequest {
  /**
   * @param {string} companyId - ID of the company to fetch
   */
  constructor(companyId) {
    this.companyId = companyId;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      companyId: this.companyId
    };
  }
}

/**
 * Company creation request class
 */
export class CompanyCreationRequest {
  /**
   * @param {string} name - Company name
   * @param {string} address - Company address
   * @param {string} contactEmail - Company contact email
   * @param {string} contactPhone - Company contact phone
   */
  constructor(name, address, contactEmail, contactPhone) {
    this.name = name;
    this.address = address;
    this.contactEmail = contactEmail;
    this.contactPhone = contactPhone;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      name: this.name,
      address: this.address,
      contactEmail: this.contactEmail,
      contactPhone: this.contactPhone
    };
  }
}

/**
 * ===========================
 * Schedule Requests
 * ===========================
 */

/**
 * Schedule fetch request class
 */
export class ScheduleRequest {
  /**
   * @param {string} startDate - Start date in ISO format (e.g., "2023-12-01")
   * @param {string} endDate - End date in ISO format (e.g., "2023-12-31")
   * @param {string} [userId] - Optional user ID to filter by
   */
  constructor(startDate, endDate, userId = null) {
    this.startDate = startDate;
    this.endDate = endDate;
    this.userId = userId;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    const result = {
      startDate: this.startDate,
      endDate: this.endDate
    };

    if (this.userId) {
      result.userId = this.userId;
    }

    return result;
  }
}

/**
 * New schedule creation request class
 */
export class NewScheduleRequest {
  /**
   * @param {Object} params - Schedule parameters
   * @param {string} params.date - Schedule date (ISO format)
   * @param {string} params.startTime - Start time (HH:MM format)
   * @param {string} params.endTime - End time (HH:MM format)
   * @param {string} params.locationId - ID of the location
   * @param {string} params.taskTypeId - ID of the task type
   * @param {string[]} [params.assignedUserIds=[]] - Array of user IDs assigned to the task
   */
  constructor({
                date,
                startTime,
                endTime,
                locationId,
                taskTypeId,
                assignedUserIds = []
              }) {
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.locationId = locationId;
    this.taskTypeId = taskTypeId;
    this.assignedUserIds = assignedUserIds;
  }

  /**
   * Adds a user to the assigned users list
   * @param {string} userId - User ID to assign to this schedule
   * @returns {NewScheduleRequest} This instance for chaining
   */
  assignUser(userId) {
    if (!this.assignedUserIds.includes(userId)) {
      this.assignedUserIds.push(userId);
    }
    return this;
  }

  /**
   * Removes a user from the assigned users list
   * @param {string} userId - User ID to remove from this schedule
   * @returns {NewScheduleRequest} This instance for chaining
   */
  unassignUser(userId) {
    this.assignedUserIds = this.assignedUserIds.filter(id => id !== userId);
    return this;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      date: this.date,
      startTime: this.startTime,
      endTime: this.endTime,
      locationId: this.locationId,
      taskTypeId: this.taskTypeId,
      assignedUserIds: this.assignedUserIds
    };
  }
}

/**
 * ===========================
 * Location Requests
 * ===========================
 */

/**
 * Location fetch request class
 */
export class LocationsRequest {
  /**
   * @param {string} companyId - ID of the company
   */
  constructor(companyId) {
    this.companyId = companyId;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      companyId: this.companyId
    };
  }
}

/**
 * New location creation request class
 */
export class AddLocationRequest {
  /**
   * @param {string} companyId - ID of the company
   * @param {string} name - Location name
   * @param {string} address - Location address
   * @param {Object} [coordinates=null] - Optional GPS coordinates
   * @param {number} coordinates.latitude - Latitude
   * @param {number} coordinates.longitude - Longitude
   */
  constructor(companyId, name, address, coordinates = null) {
    this.companyId = companyId;
    this.name = name;
    this.address = address;
    this.coordinates = coordinates;
  }

  /**
   * Sets coordinates for this location
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {AddLocationRequest} This instance for chaining
   */
  setCoordinates(latitude, longitude) {
    this.coordinates = { latitude, longitude };
    return this;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    const result = {
      companyId: this.companyId,
      name: this.name,
      address: this.address
    };

    if (this.coordinates) {
      result.coordinates = this.coordinates;
    }

    return result;
  }
}

/**
 * ===========================
 * Task Requests
 * ===========================
 */

/**
 * Task types fetch request class
 */
export class TaskTypesRequest {
  /**
   * @param {string} companyId - ID of the company
   */
  constructor(companyId) {
    this.companyId = companyId;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      companyId: this.companyId
    };
  }
}

/**
 * New task type creation request class
 */
export class AddTaskTypeRequest {
  /**
   * @param {string} companyId - ID of the company
   * @param {string} name - Task type name
   * @param {string} description - Task type description
   * @param {number} defaultDuration - Default duration in minutes
   */
  constructor(companyId, name, description, defaultDuration) {
    this.companyId = companyId;
    this.name = name;
    this.description = description;
    this.defaultDuration = defaultDuration;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      companyId: this.companyId,
      name: this.name,
      description: this.description,
      defaultDuration: this.defaultDuration
    };
  }
}

/**
 * Task completion request class
 */
export class TaskCompletionRequest {
  /**
   * @param {string} taskId - ID of the task to mark complete
   * @param {string} notes - Completion notes
   * @param {string[]} [photoUrls=[]] - Optional array of photo URLs
   */
  constructor(taskId, notes, photoUrls = []) {
    this.taskId = taskId;
    this.notes = notes;
    this.photoUrls = photoUrls;
    this.completedAt = new Date().toISOString();
  }

  /**
   * Adds a photo URL to the documentation
   * @param {string} url - Photo URL to add
   * @returns {TaskCompletionRequest} This instance for chaining
   */
  addPhoto(url) {
    this.photoUrls.push(url);
    return this;
  }

  /**
   * Converts request to JSON-ready format
   * @returns {Object} Plain object representation
   */
  toJSON() {
    return {
      taskId: this.taskId,
      notes: this.notes,
      photoUrls: this.photoUrls,
      completedAt: this.completedAt
    };
  }
}