const router = require('express').Router()
const auth   = require('../middleware/auth')
const role   = require('../middleware/role')
const ctrl   = require('../controllers/userController')

// Any authenticated user can change their own password
router.patch('/me/password', auth, ctrl.changePassword)

// Admin only
router.use(auth, role('admin'))
router.get('/',       ctrl.getUsers)
router.get('/agents', ctrl.getAgents)
router.post('/',      ctrl.createUser)
router.patch('/:id',  ctrl.updateAgent)

module.exports = router
