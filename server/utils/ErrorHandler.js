class ErrorHandler extends Error {
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode;
        console.log("\n\nError Track back:")
        Error.captureStackTrace(this, this.constructor)
    }
}

// class ErrorHandler  {
//     constructor(message, statusCode){
//         // super(message)
//         this.statusCode = statusCode;
//         console.log("\nstatus: ", this.statusCode, message)
//         // console.log("\n\nError Track back:")
//         // Error.captureStackTrace(this, this.constructor)
//     }
// }

module.exports = ErrorHandler;