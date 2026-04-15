class ApiError extends Error {
    constructor(                 //over ride constructor         
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""       //given by error class
    ){
        super(message)     //over ride constructor msg
        this.statusCode = statusCode
        this.data = null         // research, in nodejs
        this.message = message
        this.success = false     //success code will not be sent, handling error not response 
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError};