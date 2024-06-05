const express = require('express')
const router = express.Router();
const {register, login, resetPassword} = require('../controllers/auth');

// #swagger.tags = ['Auth'];

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/resetPassword').patch(resetPassword)

module.exports = router