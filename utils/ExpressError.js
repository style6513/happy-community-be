class ExpressError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// /** 404 NOT FOUND error. */
// class NotFoundError extends ExpressError {
//   constructor(message = "Not found") {
//     super(message, 404);
//   }
// }

// /** 401 UNAUTHORIZED error */
// class UnauthorizedError extends ExpressError {
//   constructor(message = "Unauthorized") {
//     super(message, 401)
//   }
// }

// /** 400 BAD REQUEST error */
// class BadRequestError extends ExpressError {
//   constructor(message = "Bad Request") {
//     super(message, 400)
//   }
// }

// /** 403 BAD REQUEST error */
// class ForbiddenError extends ExpressError {
//   constructor(message = "Bad Request") {
//     super(message, 403)
//   }
// }

module.exports = {
  ExpressError,
};