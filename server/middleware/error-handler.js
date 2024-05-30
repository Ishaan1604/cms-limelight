const {StatusCodes} = require('http-status-codes');

const errorHandler = async(err, req, res, next) => {
  // console.log(err)
    const errObject = {
        message: err.message || 'Something went wrong',
        statusCode: err.statusCode || 500
    }
    if (err.name === 'ValidationError') {
        errObject.msg = Object.values(err.errors)
          .map((item) => item.message)
          .join(',');
        errObject.statusCode = 400;
      }
      if (err.code && err.code === 11000) {
        errObject.msg = `Duplicate value entered for ${Object.keys(
          err.keyValue
        )} field, please choose another value`;
        errObject.statusCode = 400;
      }
      if (err.name === 'CastError') {
        errObject.msg = `No item found with id : ${err.value}`;
        errObject.statusCode = 404;
      }

    return res.status(errObject.statusCode).json({msg: errObject.message})
}

module.exports = errorHandler;