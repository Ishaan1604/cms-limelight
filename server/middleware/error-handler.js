const {StatusCodes} = require('http-status-codes');

const errorHandler = async(err, req, res, next) => {
  // console.log(err)
    const errObject = {
        msg: err.message || 'Something went wrong',
        statusCode: err.statusCode || 500
    }
    if (err.name === 'ValidationError') {
        errObject.msg = err._message + ': missing '+ Object.keys(err.errors).join(', ');
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

    return res.status(errObject.statusCode).json({msg: errObject.msg})
}

module.exports = errorHandler;