const {StatusCodes} = require('http-status-codes')

const notFound = async(req, res, next) => {
    res.status(StatusCodes.NOT_FOUND).send("Page not found")
}

module.exports = notFound