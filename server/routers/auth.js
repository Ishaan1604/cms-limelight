const express = require('express')
const router = express.Router();
const {register, login, resetPassword} = require('../controllers/auth');

/**
 * @swagger
 * /auth/register:
 *  post:
 *      summary:
 *      requestBody:
 *          required: true
 *          content: 
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Person'
 *      responses:
 *          summary: Lets a user register
 *          201: 
 *              description: The newly created user
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref '#components/schemas/Person'
 *          400:
 *              description: A mongoose validation or duplication error
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/Error'
 *          500:
 *              description: Internal server error
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/Error'
 *              
 * 
 * */ 
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/resetPassword').patch(resetPassword)

module.exports = router