const UserPolicy = require('../models/UserPolicy')

const expireFn = async() => {
    await UserPolicy.updateMany({validity: {$lte: Date.now() + 600 * 1000}}, {expired: true}, {runValidators: true})
}

module.exports = expireFn