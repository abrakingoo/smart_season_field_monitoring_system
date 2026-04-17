const router = require('express').Router()
const auth   = require('../middleware/auth')
const role   = require('../middleware/role')
const ctrl   = require('../controllers/userController')

router.use(auth, role('admin'))

router.get('/',         ctrl.getUsers)
router.get('/agents',   ctrl.getAgents)
router.post('/',        ctrl.createUser)

module.exports = router
