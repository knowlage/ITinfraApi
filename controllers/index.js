const express = require('express')
    , router = express.Router()

router.use('/users', require('./users'))
router.use('/auth', require('./auth'))
router.use('/faqs', require('./faqs'))
router.use('/uploads', require('./uploads'))
router.use('/download', require('./download'))
router.use('/news', require('./news'))

module.exports = router