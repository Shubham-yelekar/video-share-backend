class ApiResponse {
    constructor(statusCode, data, message = "succcess"){
        this.statusCode = statusCode
        this.data= data
        this.massage = message
        this.success = statusCode < 400
    }
}

export {ApiResponse}