const express = require('express');
const router = express.Router();

const {getAllUsers, getUser, getAllClaims, getClaim, updateClaim} = require('../controllers/adminSide')
const {createPolicy, updatePolicy, deletePolicy} = require('../controllers/policy')

router.route('/users').get(getAllUsers)
router.route('/users/:user_id').get(getUser)
router.route('/users/:user_id/claims').get(getAllClaims)
router.route('/users/:user_id/claims/:claim_id').get(getClaim).patch(updateClaim)

router.route('/policies').post(createPolicy)
router.route('/policies/:policy_id').patch(updatePolicy).delete(deletePolicy)
router.route('/policies/:policy_id/claims').get(getAllClaims)
router.route('/policies/:policy_id/claims/:claim_id').get(getClaim).patch(updateClaim)

router.route('/claims').get(getAllClaims)
router.route('/claims/:claim_id').get(getClaim).patch(updateClaim)

module.exports = router