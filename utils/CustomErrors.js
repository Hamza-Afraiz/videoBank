class CustomError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent class constructor
    this.statusCode = statusCode; // Custom property for status code
    this.name = this.constructor.name; // Set the error name to the class name

    // Capture the stack trace (optional)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, 404); // Set default status code to 404
  }
}

class ValidationError extends CustomError {
  constructor(message = "Validation failed") {
    super(message, 400); // Set default status code to 400
  }
}

class AuthenticationError extends CustomError {
  constructor(message = "Authentication failed") {
    super(message, 401); // Set default status code to 401
  }
}

class AuthorizationError extends CustomError {
  constructor(message = "Authorization denied") {
    super(message, 403); // Set default status code to 403
  }
}

class DatabaseError extends CustomError {
  constructor(message = "Database error occurred") {
    super(message, 500); // Set default status code to 500
  }
}

// Export all custom errors
module.exports = {
  CustomError,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  DatabaseError,
};
