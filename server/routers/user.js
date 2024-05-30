const express = require('express')
const router = express.Router();
const {makeClaim, addPolicy, getAllUserClaims, getAllUserPolicy, getUserPolicy, updateUser, deleteUser} = require('../controllers/userSide');

router.route('/').delete(deleteUser)
router.route('/:policy_id').post(addPolicy)
router.route('/myPolicies').get(getAllUserPolicy)
router.route('/myPolicies/:policy_id').get(getUserPolicy).post(makeClaim)
router.route('/myClaims').get(getAllUserClaims)
router.route('/updateUser').patch(updateUser)


module.exports = router