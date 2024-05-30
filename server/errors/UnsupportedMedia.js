const CustomAPIError = require('./customAPIError');
const {StatusCodes} = require('http-status-codes')

class UnsupportedMediaError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNSUPPORTED_MEDIA_TYPE;
    }
}

module.exports = UnsupportedMediaError
