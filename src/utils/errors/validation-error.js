// const { StatusCodes } = require('http-status-codes');

// class ValidationError extends Error {
//     constructor( error ) {
//         const explanation=[];
//         error.errors.array.forEach(err => {
//             explanation.push(err.message);
            
//         });
//         super(error.message);  
//         this.name = 'ValidationError';  
//         this.explanation = explanation;  
//         this.statusCode =  StatusCodes.BAD_REQUEST ; 
//     }
// }

// module.exports = ValidationError;
const { StatusCodes } = require('http-status-codes');

class ValidationError extends Error {
    constructor(error) {
        // Initialize an empty array to store the explanation messages
        const explanation = [];

        // Check if error.errors exists and is an array before looping
        if (error && Array.isArray(error.errors)) {
            error.errors.forEach(err => {
                explanation.push(err.message);
            });
        }

        // Call the parent class (Error) constructor with the error message
        super(error?.message || 'Validation error occurred');  

        // Set properties for this error class
        this.name = 'ValidationError';  
        this.explanation = explanation.length ? explanation : ['Unknown validation error'];  // Fallback if no explanation
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = ValidationError;
