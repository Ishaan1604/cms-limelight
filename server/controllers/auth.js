const {BadRequestError, UnsupportedMediaError} = require('../errors')
const Person = require('../models/Person')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes')
require('dotenv').config();

const register = async(req, res) => {
    const people = await Person.find({});

    const role = people.length > 0 ? 'user' : 'admin'

    const person = await Person.create({...req.body, personType: role})
    const token = jwt.sign({name: person.name, email: person.email, type: person.personType}, process.env.JWT_SECRET, {'expiresIn': '30d'})
    res.status(StatusCodes.CREATED).json({person, token})
}

const login = async(req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide an email and password')
    }

    const person = await Person.findOne({email});
    
    if (!person) {
        throw new BadRequestError('Incorrect email, please try again')
    }

    const isMatch = await bcrypt.compare(password, person.password)
    if (!isMatch) {
        throw new BadRequestError('Incorrect password, please try again')
    }

    const token = jwt.sign({name: person.name, email: person.email, type: person.personType}, process.env.JWT_SECRET, {'expiresIn': '30d'})
    res.status(StatusCodes.OK).json({person, token})
}

const resetPassword = async(req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide an email and password')
    }

    let person = await Person.findOne({email});
    
    if (!person) {
        throw new BadRequestError('Incorrect email, please try again')
    }

    person.password = password

    // person = await Person.findOneAndUpdate({email}, {...person}, {new: true, runValidators: true})
    await person.save();
    res.status(StatusCodes.OK).json({person})
    
}

module.exports = {
    register,
    login,
    resetPassword,
}