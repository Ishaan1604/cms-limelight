const {StatusCodes} = require('http-status-codes');
const UserPolicy = require('../models/UserPolicy');
const Policy = require('../models/Policy')
const { NotFoundError, BadRequestError, UnsupportedMediaError } = require('../errors');
const Claim = require('../models/Claim')
const fs = require('fs/promises');
const Person = require('../models/Person');
const jwt = require('jsonwebtoken');

const getAllUserPolicy = async(req, res) => {
    /* #swagger.responses[200] = {
        "description": "Got all the policies for this user",
            "content": {
              "application/json":{
                "schema":{
                  "type": "array",
                  "items": {
                    $ref: "#/components/schemas/UserPolicy"
                  }
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["User"]
    const {_id: userId} = req.user

    const {sort, limit, page, policyName, policyType, expired, policyId} = req.query;
    let filterObj = {userId}

    if (policyName) {
        filterObj.policyName = {$regex: new RegExp(policyName), $options: 'i'}
    }

    if (policyType) {
        filterObj.policyType = {$in : policyType.split(' ')};
    }

    if (policyId) {
        filterObj.policyId = policyId;
    }

    filterObj.expired = expired ? {$in : expired.split(' ')} :  false

    const pageSort = sort || 'validity'
    const pageLimit = limit || 10;
    const pageNumber = Number(page) - 1 || 0;
    const skip = (pageLimit * pageNumber)

    // const {policyName, policyType, expired, userId} = req.filterObj;
    let myPolicies = await UserPolicy
                                        .find({...filterObj})
                                        .sort(pageSort)
                                        .skip(skip)
                                        .limit(pageLimit);
    

    res.status(StatusCodes.OK).json({myPolicies})
}

const getUserPolicy = async(req, res) => {
     /* #swagger.responses[200] = {
        "description": "Got a specific policy for this user",
            "content": {
              "application/json":{
                "schema":{
                  $ref: "#/components/schemas/UserPolicy"
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[404] = {"description": "No policy found with this id for this user"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["User"]
    const {_id: userId} = req.user
    const {policy_id: policyId} = req.params;
    // console.log(req.params)
    // const {policyId, userId} = req.filterObj;

    const myPolicy = await UserPolicy.findOne({_id: policyId, userId});
    if (!myPolicy) {
        throw new NotFoundError(`No policy with id: ${policyId} for user: ${req.user.name}`)
    }

    res.status(StatusCodes.OK).json({myPolicy})
}

const getAllUserClaims = async(req, res) => {
    /* #swagger.responses[200] = {
        "description": "Got all the claims for this user",
            "content": {
              "application/json":{
                "schema":{
                  "type": "array",
                  "items": {
                    $ref: "#/components/schemas/Claim"
                  }
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["User"]
    const {_id: userId} = req.user;

    const {policyName, policyType, status, sort, page, limit, policyId} = req.query;
    let filterObj = {userId}

    if (policyName) {
        filterObj.policyName = {$regex: new RegExp(policyName), $options: 'i'}
    }

    if (policyType) {
        filterObj.policyType = {$in : policyType.split(' ')};
    }

    if (policyId) {
        filterObj.policyId = policyId
    }

    filterObj.status = status ? {$in : status.split(' ')} :  'pending'

    const pageSort = sort || 'updatedAt';

    const pageLimit = limit || 10;
    const pageNumber = Number(page) - 1 || 0;
    const skip = (pageLimit * pageNumber)

    
    const claims = await Claim
                                .find({...filterObj})
                                .sort(pageSort)
                                .skip(skip)
                                .limit(pageLimit);

    res.status(StatusCodes.OK).json({claims})
}

const addPolicy = async(req, res) => {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#components/schemas/Policy"
                    }  
                }
            }
        } 
    */

     /* #swagger.responses[201] = {
        "description": "Created a new policy for this user",
            "content": {
              "application/json":{
                "schema":{
                  $ref: "#/components/schemas/UserPolicy"
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["User"]
    const {_id: userId} = req.user;
    const {policy_id: policyId} = req.params;

    const {claimAmount: amountRemaining, validity, name : policyName, policyType} = await Policy.findOne({_id: policyId})
    let expirationDate = new Date();

    const time = validity.split(',')
    const year = Number(time[0].split(' ')[0])
    const month = Number(time[1].split(' ')[0])
    expirationDate.setFullYear(expirationDate.getFullYear() + year)
    expirationDate.setMonth(expirationDate.getMonth() + month)

    const myPolicy = await UserPolicy.create({userId, policyId, policyName, policyType, amountRemaining, validity: expirationDate})
    res.status(StatusCodes.CREATED).json({myPolicy})
}

const makeClaim = async(req, res) => {
        /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        "type": "object",
                        "properties": {
                            "userId": {
                                "type": "string"
                            },
                            "policyId": {
                                "type": "string"
                            },
                            "policyName": {
                                "type": 'string'
                            },
                            "policyType": {
                                "type": "string",
                                "enum": ['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness']
                            },
                            "description": {
                                "type": 'string',
                            },
                            "claimAmount": {
                                "type": 'number',
                                "description": 'The amount of money being claimed'
                            },
                            "document": {
                                "type": 'buffer',
                                "description": 'The evidence for the claim'
                            },
                        }
                    }  
                }
            }
        } 
    */

     /* #swagger.responses[201] = {
        "description": "Created a new claim",
            "content": {
              "application/json":{
                "schema":{
                  $ref: "#/components/schemas/Claim"
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["User"]
    const {_id: userId} = req.user;
    const {policy_id: policyId} = req.params;
    
    if (!req.files.file.mimetype.startsWith('image') && !req.files.file.mimetype.endsWith('pdf') && !req.files.file.mimetype.endsWith('mp4')) {
        throw new UnsupportedMediaError(`${req.files.file.mimetype.split('/')[1]} unsupported. Kindly enter a pdf, png/jpeg, or mp4`)
    }
    const userPolicy = await UserPolicy.findOne({userId, _id: policyId});


    if (userPolicy.validity.getTime() < Date.now() + 600000) {
        throw new BadRequestError(`Policy with id: ${policyId} has expired or will expire in 10mins`)
    }

    const {claimAmount} = req.body

    if (Number(claimAmount) > userPolicy.amountRemaining) {
        throw new BadRequestError('Claim amount exceeds amount left in policy. Kindly change')
    }

    const claim = await Claim.create({userId, policyId, ...req.body, document: req.files.file.data})
    const policy = await Policy.findOne({_id: userPolicy.policyId})
    const claims = policy.claims > 0 ? policy.claims + 1 : 1;
    policy.claims = claims;
    await policy.save()
    const user = await Person.findOneAndUpdate({_id: userId}, {...req.user, claims: req.user.claims + 1}, {new: true, runValidators: true})
    res.status(StatusCodes.CREATED).json({claim})
}

const updateUser = async(req, res) => {
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
                        }
                    }  
                }
            }
        } 
    */

    /* #swagger.responses[200] = {
        "description": "User updated",
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
    // #swagger.responses[404] = {"description": "No user with this id"}
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ['User']
    const {_id: userId} = req.user;

    const user = await Person.findOneAndUpdate({_id: userId}, {...req.body, personType: 'user', password: req.user.password}, {new: true, runValidators: true})
    if (!user) {
        throw new NotFoundError(`No user with id: ${userId} found`)
    }
    const token = jwt.sign({name: user.name, email: user.email, type: user.personType}, process.env.JWT_SECRET, {'expiresIn': '30d'})
    res.status(StatusCodes.OK).json({user, token})
}

const deleteUser = async(req, res) => {
    const {_id: userId} = req.user;
    /* #swagger.responses[200] = {
        "description": "User deleted",
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
    // #swagger.responses[404] = {"description": "No user with this id"}
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ['User']

    const user = await Person.findOneAndDelete({_id: userId})
    if (!user) {
        throw new NotFoundError(`No user with id: ${userId} found`)
    }
    res.status(StatusCodes.OK).json({user})
}


module.exports = {
    addPolicy,
    makeClaim,
    getAllUserClaims,
    getAllUserPolicy,
    getUserPolicy,
    updateUser,
    deleteUser,
}