const mongoose = require('mongoose');

const policySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a policy name'],
    },
    policyType: {
        type: String,
        enum: ['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness'],
        required: [true, 'Please provide a policy type']
    },
    description: {
        type: String,
    },
    cost: {
        type: String,
        required: [true, 'Please provide the costings for the following policy'],
    },
    claimAmount: {
        type: Number,
        required: [true, 'Please provide a claim amount']
    },
    validity: {
        type: String,
        required: [true, 'Please provide the validity of this policy']
    },
    active: {
        type: Boolean,
        default: true,
    },
    claims: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
})


module.exports = mongoose.model('Policy', policySchema)