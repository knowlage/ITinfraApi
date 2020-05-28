const express = require('express')
const mysql = require('mysql2')
const config = require('../config/config.json')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const router = express.Router()
const conn = mysql.createPool(config.database)

var storage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, path.join(__dirname,"../assets/uploads/"))
    },
    filename:(req, file, cb)=> {
        cb(null, file.originalname)
    }
})

var carouselStorage = multer.diskStorage({
    destination:(req, file, cb) => {
        cb(null, path.join(__dirname,"../assets/carousel/"))
    },
    filename:(req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})
const carouselUpload = multer({storage: carouselStorage})

router.get('/',(req,res) => {
    res.end('hi download page')
})

router.get('/getUploads',(req,res) => {
    let sql = 'call Upload_get_upload()'
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,(err,rs,field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"Upload Not Found"})
                }  
            }
        })
    })
})

router.get('/getUploadSearch/:search?',(req,res) => {
    let sql = 'call Upload_search(?)'
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,[req.params.search || ' '],(err,rs,field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"Upload Not Found"})
                }
            }
        })
    })
})

router.get('/getUploadFeature',(req,res) => {
    let sql = 'call Upload_get_upload_feature()'
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,(err,rs,field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"Upload Not Found"})
                }
            }
        })
    })
})

router.post('/uploadFile', upload.single('file'), (req, res) => {
    res.status(200).json({"code":1, "message":"UploadFile Complete"})
})



router.get('/uploadFile', (req, res) => {
    let dir = path.join(__dirname,"../assets/uploads/")
    let files = fs.readdirSync(dir)
        .map(f => {
            return{
                name:f,
                time:fs.statSync(dir + f).mtime.getTime(),
                type:path.extname(f)
            }
        })
        .sort((a, b) => {
            return b.time - a.time
        })
           
    res.status(200).json({"code":1,"message":"get success","data":files})

})

router.delete('/deleteUploadFile/:fileName', (req, res) => {
    let file = req.params.fileName
    let dir = path.join(__dirname,"../assets/uploads/")
    fs.unlinkSync(dir + file)
    res.status(200).json({"code":1,"message":"delete success"})
})

router.delete('/deleteCarouselFile/:fileName', (req, res) => {
    let file = req.params.fileName
    let dir = path.join(__dirname,"../assets/carousel/")
    fs.unlinkSync(dir + file)
    res.status(200).json({"code":1,"message":"delete success"})
})

router.post('/uploadCarouselFile', carouselUpload.single('file'), (req, res) => {
    res.status(200).json({"code":1, "message":"UploadCarouselFile Complete"})
} )

router.get('/carouselFile', (req, res) => {
    let dir = path.join(__dirname,"../assets/carousel/")
    let files = fs.readdirSync(dir)
        .map(f => {
            return{
                name:f,
                time:fs.statSync(dir + f).mtime.getTime(),
                type:path.extname(f)
            }
        })
        .sort((a, b) => {
            return b.time - a.time
        })
           
    res.status(200).json({"code":1,"message":"get success","data":files})

})


module.exports = router