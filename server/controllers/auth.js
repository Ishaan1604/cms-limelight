const {BadRequestError, UnsupportedMediaError} = require('../errors')
const Person = require('../models/Person')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
const { dbResponseDurationSecondsFn } = require('../utils/metrics');
require('dotenv').config();

const register = async(req, res) => {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": "string"
                            },
                            "email": {
                                "type": "string",
                                "format": "email"
                            },
                            "password": {
                                "type": "string"
                            }
                        }
                    }  
                }
            }
        } 
    */

    /* #swagger.responses[201] = {
        "description": "New user created",
            "content": {
              "application/json":{
                "schema":{
                  allOf: [
                    {$ref: "#/components/schemas/Person"},
                    {$ref: "#/components/schemas/jwtToken"}
                  ]
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ['Auth']
    const people = await Person.find({});

    const role = people.length > 0 ? 'user' : 'admin'

    

    const person = await dbResponseDurationSecondsFn(() => Person.create({...req.body, personType: role}), 'create_user')
    const token = jwt.sign({name: person.name, email: person.email, type: person.personType}, process.env.JWT_SECRET, {'expiresIn': '30d'})
    res.status(StatusCodes.CREATED).json({person, token})
}

const login = async(req, res) => {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        "type": "object",
                        "properties": {
                            "email": {
                                "type": "string",
                                "format": "email"
                            },
                            "password": {
                                "type": "string"
                            }
                        }
                    }  
                }
            }
        } 
    */

    /* #swagger.responses[200] = {
        "description": "User successfully logged in",
            "content": {
              "application/json":{
                "schema":{
                  allOf: [
                    {$ref: "#/components/schemas/Person"},
                    {$ref: "#/components/schemas/jwtToken"}
                  ]
                }
              }
            }
        } 
    */
    /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ['Auth']
    const {email, password} = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide an email and password')
    }

    const person = await dbResponseDurationSecondsFn(() => Person.findOne({email}), 'login_user');
    
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
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        "type": "object",
                        "properties": {
                            "email": {
                                "type": "string",
                                "format": "email"
                            },
                            "password": {
                                "type": "string"
                            }
                        }
                    }  
                }
            }
        } 
    */

    /* #swagger.responses[200] = {
        "description": "Password Reseted",
            "content": {
              "application/json":{
                "schema":{
                  "$ref": "#components/schemas/Person"
                }
              }
            }
        } 
    */
    /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ['Auth']
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

    await dbResponseDurationSecondsFn(() => person.save(), 'reset_password');
    res.status(StatusCodes.OK).json({person})
    
}

module.exports = {
    register,
    login,
    resetPassword,
}