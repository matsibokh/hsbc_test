export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class ExternalServiceError extends AppError {
  constructor(serviceName, details) {
    super(`${serviceName} is unavailable, please try again later`, 502);
    this.details = details;
  }
}
