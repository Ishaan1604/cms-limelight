const mongoose = require('mongoose');

const userPolicySchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide the user id'],
        ref: 'Person'
    },
    policyId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide the policy id'],
        ref: 'Policy'
    },
    policyName: {
        type: String,
        required: [true, 'Please provide a policy name'],
    },
    policyType: {
        type: String,
        enum: ['Health', 'Life', 'Auto', 'Travel', 'Property', 'Business', 'Renters', 'Homeowners', 'Disability', 'Liability', 'Pet', 'Critical Illness'],
        required: [true, 'Please provide a policy type']
    },
    amountRemaining: {
        type: Number,
        required: [true, 'Please provide the remaining amount']
    },
    validity: {
        type: Date,
        required: [true, 'Please enter the expiration date'],
    },
    expired: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
})

userPolicySchema.pre('save', async function(next) {


    if (typeof this.validity === String) {
        
    }
})


module.exports = mongoose.model('UserPolicy', userPolicySchema)