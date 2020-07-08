const express = require('express')
    , router = express.Router()

router.use('/users', require('./users'))
router.use('/auth', require('./auth'))
router.use('/faqs', require('./faqs'))
router.use('/uploads', require('./uploads'))
router.use('/download', require('./download'))
router.use('/news', require('./news'))
router.use('/contacts', require('./contacts'))
router.use('/carousels', require('./carousels'))
router.use('/dashboard', require('./dashboard'))
router.use('/computer', require('./computer'))
router.use('/software', require('./software'))

module.exports = router