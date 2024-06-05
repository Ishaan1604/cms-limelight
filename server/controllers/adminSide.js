const {StatusCodes} = require('http-status-codes');
const Person = require('../models/Person');
const {NotFoundError, BadRequestError} = require('../errors')
const Claim = require('../models/Claim')
const sgMail = require('@sendgrid/mail');
const Policy = require('../models/Policy');
const UserPolicy = require('../models/UserPolicy')
require('dotenv').config();

const getAllUsers = async(req, res) => {
    /* #swagger.responses[200] = {
        "description": "Got all the users",
            "content": {
              "application/json":{
                "schema":{
                  "type": "array",
                  "items": {
                    $ref: "#/components/schemas/Person"
                  }
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["Admin"]

    const {userName : name, email, sort, limit, page} = req.query;
    let filterObj = {}

    if (name) {
        filterObj.name = {$regex: new RegExp(name), $options: 'i'}
    }

    if (email) {
        filterObj.email = {$regex: new RegExp(email), $options: 'i'}
    }
    const pageSort = sort|| 'name'
    const pageLimit = Number(limit) || 10;
    const pageNumber = Number(page) - 1 || 0;
    const skip = (pageLimit * pageNumber)
    // const {userName: name} = req.filterObj;
    const users = await Person
                            .find({personType: 'user', ...filterObj})
                            .sort(pageSort)
                            .skip(skip)
                            .limit(pageLimit);

    res.status(StatusCodes.OK).json({users})
}

const getUser = async(req, res) => {
     /* #swagger.responses[200] = {
        "description": "Got a specific user",
            "content": {
              "application/json":{
                "schema":{
                  $ref: "#/components/schemas/Person"
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[404] = {"description": "No user found with this id"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
   //    #swagger.tags = ["Admin"]
    const {user_id} = req.params

    const user = await Person.findOne({_id: user_id, personType: 'user'});
    if (!user) {
        throw new NotFoundError(`No user with id: ${user_id} found`)
    }

    res.status(StatusCodes.OK).json({user})
}

const getAllClaims = async(req, res) => {
    // const {user_id, policy_id} = req.params;
    /* #swagger.responses[200] = {
        "description": "Got all the claims",
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
//    #swagger.tags = ["Admin"]

    const {policyName, policyType, status, sort, limit, page, policyId, userId} = req.query;
    let filterObj = {};

    if (policyName) {
        filterObj.policyName = {$regex: new RegExp(policyName), $options: 'i'}
    }

    if (policyType) {
        filterObj.policyType = filterObj.policyType = {$in : policyType.split(' ')};
    }

    if (policyId) {
        const userPolicies = await UserPolicy.find({policyId})
        filterObj.policyId = {$in : userPolicies.map((policy) => policy._id)}
    }

    if(userId) {
        filterObj.userId = userId
    }

    filterObj.status = status ? {$in : status.split(' ')} :  'pending'

    const pageSort = sort || 'updatedAt';
    const pageLimit = Number(limit) || 10;
    const pageNumber = Number(page) - 1 || 0;
    const skip = (pageLimit * pageNumber)

    // const {policyName, policyType, status, policyId, userId} = req.filterObj;
    const claims = await Claim
                            .find({...filterObj})
                            .sort(pageSort)
                            .skip(skip)
                            .limit(pageLimit);
                            
    res.status(StatusCodes.OK).json({claims})
}

const getClaim = async(req, res) => {
    /* #swagger.responses[200] = {
        "description": "Got a specific claim",
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
   /* #swagger.responses[404] = {"description": "No claim found with this id"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
   //    #swagger.tags = ["Admin"]
    const {claim_id} = req.params;
    const claim = await Claim.findOne({_id: claim_id})
    if (!claim) {
        throw new NotFoundError(`No claim found with id: ${claim_id}`)
    }
    res.status(StatusCodes.OK).json({claim})
}

const updateClaim = async(req, res) => {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        "type": "object",
                        "properties": {
                            "status": {
                                "type": "string",
                                "enum": ["pending, rejected, approved"]
                            }
                        }
                    }  
                }
            }
        } 
    */

     /* #swagger.responses[200] = {
        "description": "Claim Updated",
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
   /* #swagger.responses[404] = {"description": "No claim found with this id"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["Admin"]
    const {claim_id} = req.params;

    const claim = await Claim.findOne({_id: claim_id})
    
    if (!claim) {
        throw new NotFoundError(`No claim with id: ${claim_id} found`)
    }

    claim.status = req.body.status;

    await claim.save();
    
    const user = await Person.findOne({_id: claim.userId, personType: 'user'})
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
        to: user.email,
        from: 'ishaaniscool@gmail.com',
        subject: `Claim ${claim_id} update`,
        text: `Dear ${user.name},
                Your claim for ${claim.policyName} has been ${req.body.status}. Login for more details and further action
                Thanks,
                Team CMS
            `
    }
    await sgMail.send(msg)
    res.status(StatusCodes.OK).json({claim})
}

module.exports = {
    getAllUsers,
    getUser,
    getAllClaims,
    getClaim,
    updateClaim,
}