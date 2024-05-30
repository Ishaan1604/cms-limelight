const jwt = require('jsonwebtoken');
const {UnauthorizedError} = require('../errors')
require('dotenv').config();
const Person = require('../models/Person')

const authMiddleware = async(req, res, next) => {
    const {authorization} = req.headers;

    // console.log(authorization)

    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new UnauthorizedError('Access Denied')
    }

    const token = authorization.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const person = await Person.findOne({name: decoded.name, email: decoded.email, personType: decoded.type})
        if (!person) {
            throw new UnauthorizedError('Access Denied')
        }
        req.user = person;
        next()
    } catch (error) {
        throw new UnauthorizedError('Access Denied')
    }
}

module.exports = authMiddleware;