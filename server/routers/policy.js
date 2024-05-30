const express = require('express')
const router = express.Router();
const {getAllPolicy, getPolicy} = require('../controllers/policy')

router.route('/').get(getAllPolicy)
router.route('/:policy_id').get(getPolicy)

module.exports = router