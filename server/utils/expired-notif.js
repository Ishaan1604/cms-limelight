const UserPolicy = require('../models/UserPolicy');
const Person = require('../models/Person')
const Policy = require('../models/Policy')
const sgMail = require('@sendgrid/mail')
require('dotenv').config();

const expiredNotifFn = async() => {
    const policies = await UserPolicy.find({expired: true})
    policies.forEach(async(userPolicy) => {
        const user = await Person.findOne({_id: userPolicy.userId, personType: 'user'})
        const policy = Policy.findOne({_id: userPolicy.policyId})
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            to: user.email,
            from: 'ishaaniscool@gmail.com',
            subject: `Policy ${userPolicy.policyId} has expired`,
            text: `Dear ${user.name},
                    Your policy: ${policy.name} has expired! Login to renew or take further action
                    Thanks,
                    Team CMS
                `
        }
        await sgMail.send(msg)
    })
}

module.exports = expiredNotifFn;