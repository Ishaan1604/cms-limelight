const { UnauthorizedError } = require("../errors")

const authAdmin = async(req, res, next) => {
    if (req.user.personType !== 'admin') {
        throw new UnauthorizedError('Admins only')
    }

    next()
}

module.exports = authAdmin