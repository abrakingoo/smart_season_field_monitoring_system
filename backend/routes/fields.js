const router  = require('express').Router()
const auth    = require('../middleware/auth')
const role    = require('../middleware/role')
const ctrl    = require('../controllers/fieldController')

router.use(auth)

router.get('/',                          ctrl.getFields)
router.get('/:id',                       ctrl.getField)
router.post('/',        role('admin'),   ctrl.createField)
router.put('/:id',      role('admin'),   ctrl.updateField)
router.delete('/:id',   role('admin'),   ctrl.deleteField)
router.patch('/:id/stage',               ctrl.updateStage)
router.post('/:id/notes',                ctrl.addNote)
router.patch('/:id/assign', role('admin'), ctrl.assignField)

module.exports = router
