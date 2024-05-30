const UserPolicy = require('../models/UserPolicy');
const Person = require('../models/Person')
const Policy = require('../models/Policy')
const sgMail = require('@sendgrid/mail')
require('dotenv').config();

const expiryNotifFn = async() => {
    const policies = await UserPolicy.find({validity: {$lte: Date.now() + 86400 * 1000, $gt: Date.now()}})
    policies.forEach(async(userPolicy) => {
        const user = await Person.findOne({_id: userPolicy.userId, personType: 'user'})
        const policy = Policy.findOne({_id: userPolicy.policyId})
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: user.email,
            from: 'ishaaniscool@gmail.com',
            subject: `Policy ${userPolicy.policyId} expiring soon`,
            text: `Dear ${user.name},
                    Your policy: ${policy.name} will expire in less than 24hours! Login to renew or take further action
                    Thanks,
                    Team CMS
                `
        }
        await sgMail.send(msg)
    })
}

module.exports = expiryNotifFn;