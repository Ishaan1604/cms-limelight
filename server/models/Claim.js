const mongoose = require('mongoose');
const UserPolicy = require('./UserPolicy')

const claimSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide the user id'],
        ref: 'Person'
    },
    policyId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'Please provide the policy id'],
        ref: 'UserPolicy'
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
    description: {
        type: String,
        maxlength: 200,
    },
    claimAmount: {
        type: Number,
        required: [true, 'Please provide a claim amount']
    },
    status: {
        type: String,
        enum: ['pending', 'rejected', 'approved'],
        default: 'pending'
    },
    document: {
        type: Buffer,
        // required: [true, 'Please provide evidence'],
    }
}, {
    timestamps: true,
})

claimSchema.pre('save', async function(next) {
    if (this.status === 'approved') {
        const userPolicy = await UserPolicy.findOne({_id: this.policyId, userId: this.userId})
        userPolicy.amountRemaining -= this.claimAmount;
        await userPolicy.save();
    }
    next();
})

module.exports = mongoose.model('Claim', claimSchema)