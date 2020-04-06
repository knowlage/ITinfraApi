const express = require('express')
const path = require('path')


const router = express.Router()

router.get('/:filename',(req,res)=> {
    res.download(path.join(__dirname,"../assets/uploads/"+req.params.filename))
})

module.exports = router