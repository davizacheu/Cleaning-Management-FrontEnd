// api-client.js

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

/**
 * A utility class for making API requests with proper error handling
 */
export class ApiCommunicator {
  /**
   * Makes a request to the API with the given options
   *
   * @param {string} endpoint - The API endpoint to call
   * @param {Object} options - Request configuration options
   * @param {string} options.method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {Object} [options.body] - Request body (will be JSON stringified)
   * @param {boolean} [options.auth=false] - Whether authentication is required
   * @param {boolean} [options.parseJson=true] - Whether to parse response as JSON
   * @returns {Promise<any>} - The response data
   */
  static async request(endpoint, {
    method,
    body,
    auth = false,
    parseJson = true,
    contentType = 'application/json' // Add contentType parameter with default
  }) {
    // Ensure endpoint starts with '/'
    const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

    // Setup headers
    const headers = {};

    // Only set Content-Type if it's not FormData
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = contentType;
    }

    // Add auth token if required
    if (auth) {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication required but no token found');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Setup request options
    const requestOptions = {
      method,
      headers,
    };

    // Add body if provided
    if (body) {
      // Only stringify if it's not FormData and content type is JSON
      if (!(body instanceof FormData) && contentType === 'application/json') {
        requestOptions.body = JSON.stringify(body);
      } else {
        requestOptions.body = body;
      }
    }


    try {
      const response = await fetch(url, requestOptions);
      console.log('api response:', response)
      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(
            `Request failed with status ${response.status} 
            ${errorData ? JSON.stringify(errorData, null, 2) : ''}`,
            response.status
        );
      }
      // Return the response
      if (parseJson) {
        return await response.json();
      } else {
        return await response.text();
      }

    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(`Network error: ${error.message}`, error.status);
    }
  }

  static async postFormData(endpoint, formData, auth = false) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      auth
      // No need to specify contentType - it will be omitted for FormData
    });
  }


  /**
   * Make a GET request
   */
  static async get(endpoint, auth = false) {
    return this.request(endpoint, {method: 'GET', auth});
  }

  /**
   * Make a POST request
   */
  static async post(endpoint, data, auth = false) {
    return this.request(endpoint, {method: 'POST', body: data, auth});
  }

  /**
   * Make a PUT request
   */
  static async put(endpoint, data, auth = false) {
    return this.request(endpoint, {method: 'PUT', body: data, auth});
  }

  /**
   * Make a DELETE request
   */
  static async delete(endpoint, auth = false) {
    return this.request(endpoint, {method: 'DELETE', auth});
  }
}
/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}