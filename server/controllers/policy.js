const { StatusCodes } = require('http-status-codes');
const Policy = require('../models/Policy');
const { NotFoundError } = require('../errors');

const getAllPolicy = async(req, res) => {
    const {policyName: name, policyType, sort, limit, page, active} = req.query;
    const pageSort = sort || 'name'
    // const {policyName: name, policyType} = req.filterObj
    const filterObj = {};

    if (name) {
        filterObj.name = {$regex: new RegExp(name), $options: 'i'}
    }

    if (policyType) {
        filterObj.policyType = {$in : policyType.split(' ')};
    }

    filterObj.active = active ? {$in : active.split(' ')} : 'true'

    const pageLimit = Number(limit) || 10;
    const pageNumber = Number(page) - 1 || 0;
    const skip = (pageLimit * pageNumber)

    const policies = await Policy
                                .find({...filterObj})
                                .sort(pageSort)
                                .skip(skip)
                                .limit(pageLimit)

    /* #swagger.responses[200] = {
        "description": "Got all the policies",
            "content": {
              "application/json":{
                "schema":{
                  "type": "array",
                  "items": {
                    $ref: "#/components/schemas/Policy"
                  }
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["Policy"]

                                
    res.status(StatusCodes.OK).json({policies})
}

const getPolicy = async(req, res) => {
    /* #swagger.responses[200] = {
        "description": "Got a specific policy",
            "content": {
              "application/json":{
                "schema":{
                  $ref: "#/components/schemas/Policy"
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[404] = {"description": "No policy found with this id"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["Policy"]
    const {policy_id} = req.params;

    const policy = await Policy.findOne({_id: policy_id});
    if (!policy) {
        throw new NotFoundError(`No policy with id: ${policy_id} found`)
    }

    res.status(StatusCodes.OK).json({policy})
}

const createPolicy = async(req, res) => {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        "type": "object",
                        "properties": {
                            "name": {
                                "type": 'string'
                            },
                            "policyType": {
                                "type": "string",
                                "enum": ['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness']
                            },
                            "description": {
                                "type": 'string',
                            },
                            "cost": {
                                "type": 'string',
                            },
                            "claimAmount": {
                                "type": 'number',
                                "description": 'The total amount of money that can be claimed against this policy'
                            },
                            "validity": {
                                "type": 'string',
                                "description": 'The length of time this policy lasts'
                            },
                        }
                    }  
                }
            }
        } 
    */

     /* #swagger.responses[201] = {
        "description": "Created a new policy",
            "content": {
              "application/json":{
                "schema":{
                  $ref: "#/components/schemas/Policy"
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["Admin"]
    const policy = await Policy.create(req.body)
    res.status(StatusCodes.CREATED).json({policy})
}

const updatePolicy = async(req, res) => {
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

     /* #swagger.responses[200] = {
        "description": "Policy Updated",
            "content": {
              "application/json":{
                "schema":{
                  $ref: "#/components/schemas/Policy"
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[404] = {"description": "No policy found with this id"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["Admin"]
    const {policy_id} = req.params;

    const policy = await Policy.findOneAndUpdate({_id: policy_id}, {...req.body}, {new: true, runValidators: true})
    if (!policy) {
        throw new NotFoundError(`No policy with id: ${policy_id} found`)
    }
    res.status(StatusCodes.OK).json({policy})
}

const deletePolicy = async(req, res) => {
    /* #swagger.responses[200] = {
        "description": "Deleted the policy",
            "content": {
              "application/json":{
                "schema":{
                  $ref: "#/components/schemas/Policy"
                }
              }
            }
        } 
    */
   /* #swagger.responses[400] = {"description": "Either a missing value or a duplicate value"} */
   /* #swagger.responses[404] = {"description": "No policy found with this id"} */
   /* #swagger.responses[500] = {"description": "Internal Server Error"} */
//    #swagger.tags = ["Admin"]
    const {policy_id} = req.params;

    const policy = await Policy.findOneAndDelete({_id: policy_id})
    if (!policy) {
        throw new NotFoundError(`No policy with id: ${policy_id} found`)
    }
    res.status(StatusCodes.OK).json({policy})
}

module.exports = {
    getAllPolicy,
    getPolicy,
    createPolicy,
    updatePolicy,
    deletePolicy,
}