const { StatusCodes } = require('http-status-codes');

class ServiceError extends Error {
    constructor(
        message = 'Something went wrong', 
        explanation = 'Service layer error', 
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    ) {
        super(message);  // 'super' ko call karte hain base (Error) class ka constructor use karne ke liye
        this.name = 'ServiceError'; // Custom error ka naam set kar rahe hain
        this.explanation = explanation;  // Additional custom explanation property
        this.statusCode = statusCode;  // HTTP status code
    }
}

module.exports = ServiceError;
