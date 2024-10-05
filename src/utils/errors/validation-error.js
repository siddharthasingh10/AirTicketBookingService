const { StatusCodes } = require('http-status-codes');

class ValidationError extends Error {
    constructor( error ) {
        const explanation=[];
        error.errors.array.forEach(err => {
            explanation.push(err.message);
            
        });
        super(error.message);  
        this.name = 'ValidationError';  
        this.explanation = explanation;  
        this.statusCode =  StatusCodes.BAD_REQUEST ; 
    }
}

module.exports = ValidationError;
 