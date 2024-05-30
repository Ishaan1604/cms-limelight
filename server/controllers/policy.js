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
        filterObj.policyType = {$in : policyType.split(',')};
    }

    filterObj.active = active || true;

    const pageLimit = Number(limit) || 10;
    const pageNumber = Number(page) - 1 || 0;
    const skip = (pageLimit * pageNumber)

    const policies = await Policy
                                .find({...filterObj})
                                .sort(pageSort)
                                .skip(skip)
                                .limit(pageLimit)

                                
    res.status(StatusCodes.OK).json({policies})
}

const getPolicy = async(req, res) => {
    const {policy_id} = req.params;

    const policy = await Policy.findOne({_id: policy_id});
    if (!policy) {
        throw new NotFoundError(`No policy with id: ${policy_id} found`)
    }

    res.status(StatusCodes.OK).json({policy})
}

const createPolicy = async(req, res) => {
    const policy = await Policy.create(req.body)
    res.status(StatusCodes.CREATED).json({policy})
}

const updatePolicy = async(req, res) => {
    const {policy_id} = req.params;

    const policy = await Policy.findOneAndUpdate({_id: policy_id}, {...req.body}, {new: true, runValidators: true})
    if (!policy) {
        throw new NotFoundError(`No policy with id: ${policy_id} found`)
    }
    res.status(StatusCodes.OK).json({policy})
}

const deletePolicy = async(req, res) => {
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