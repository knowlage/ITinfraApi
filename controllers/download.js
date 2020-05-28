const express = require('express')
const path = require('path')
const config = require('../config/config.json')
const mysql = require('mysql2')


const router = express.Router()
const conn = mysql.createPool(config.database)

router.get('/file/:filename',(req,res)=> {
    res.download(path.join(__dirname,"../assets/uploads/"+req.params.filename))
})

router.get('/carousel/:filename',(req,res)=> {
    res.download(path.join(__dirname,"../assets/carousel/"+req.params.filename))
})

router.get('/getDownloadAll', (req, res) => {
    let sql = 'call Upload_get_upload_all()'
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql, (err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err}) 
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1, "message":"get complete", "data":rs[0]})
                }else{
                    res.status(200).json({"code":0, "message":"get fail"})
                }
            }
        })
    })
})


router.delete('/deleteDownload/:id', (req,res) => {
    let id = req.params.id
    let sql = "call Upload_delete(?)"
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql, [id], (err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
            }else{
                if(rs['affectedRows'] == 1){
                    res.status(200).json({"code":1, "message":"Delete Success"})
                }else{
                    res.status(200).json({"code":0, "message":"Delete Fail"})
                }
            }
        })
    })
})

function putUpdate(req, res, sql, params){
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql, params, (err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":1, "message":err})
            }else{
                if(rs['affectedRows'] == 1){
                    res.status(200).json({"code":1, "message":"Update Complete"})
                }else{
                    res.status(200).json({"code":0, "message":"Update Fail"})
                }
            }
        })
    })
}

router.put('/pinActivateDownload/:id', (req, res) => {
    let id = req.params.id
    let sql = 'call Upload_pin_activate(?)'
    putUpdate(req, res, sql, id)
})

router.put('/pinDeactivateDownload/:id', (req, res) => {
    let id = req.params.id
    let sql = 'call Upload_pin_deactivate(?)'
    putUpdate(req, res, sql, id)
})

router.put('/activateDownload/:id', (req, res) => {
    let id = req.params.id
    let sql = 'call Upload_activate(?)'
    putUpdate(req, res, sql, id)
})

router.put('/deactivateDownload/:id', (req, res) => {
    let id = req.params.id
    let sql = 'call Upload_deactivate(?)'
    putUpdate(req, res, sql, id)
})

function postInsert(req, res, sql ){
    let title = req.body.uploadTitle
    let filename = req.body.uploadFilename
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql, [title, filename], (err, rs, field) =>{
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
            }else{
                if(rs['affectedRows'] == 1){
                    res.status(200).json({"code":1, "message":"insert success"})
                }else{
                    res.status(200).json({"code":0, "message":"insert fail"})
                }
            }
        })
    })
}

router.post('/postInsertDownload', (req, res) => {    
    let sql = 'call Upload_insert(?, ?)'
    postInsert(req, res, sql)
})

function putInsert(req, res, sql){
    let id = req.body.id
    let title = req.body.uploadTitle
    let filename = req.body.uploadFilename
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql, [id, title, filename], (err, rs, field) =>{
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
            }else{
                if(rs['affectedRows'] == 1){
                    res.status(200).json({"code":1, "message":"update success"})
                }else{
                    res.status(200).json({"code":0, "message":"update fail"})
                }
            }
        })
    })
}

router.put('/putInsertDownload', (req, res) => {
    let sql = 'call Upload_update(?, ?, ?)'
    putInsert(req, res, sql)
})


module.exports = router