const CustomAPIError = require('./customAPIError');
const UnauthorizedError = require('./UnauthorizedError')
const BadRequestError = require('./BadRequestError')
const NotFoundError = require('./NotFoundError')
const UnsupportedMediaError = require('./UnsupportedMedia')


module.exports = {
    CustomAPIError,
    UnauthorizedError,
    BadRequestError,
    NotFoundError,
    UnsupportedMediaError,
}