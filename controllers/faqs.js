const express = require('express')
const mysql = require('mysql2')
const config = require('../config/config.json')


const router = express.Router()
const conn = mysql.createPool(config.database)

function getQuery(req, res, sql, params = '' ){
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql,[params],(err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1, "message":"Access Complete", "data":rs[0]})
                }else{
                    res.status(200).json({"code":1, "message":"FAQs Not Found"})
                }
            }
        })
    })

}

router.get('/getFaqsAll',(req,res) => {
    let sql = 'call FAQs_get_faqs_all()'
    getQuery(req, res, sql)
})

router.get('/getfaqs',(req,res) => {
    let sql = 'call FAQs_get_faqs()'
    getQuery(req, res, sql)
})


router.get('/getFaqsSearch/:_search?',(req,res) => {   

    let sql = "call FAQs_search(?)"
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,[req.params._search || ' '],(err,rs,field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"FAQs Not Found"})
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
        connection.query(sql, [params], (err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
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

router.put('/putActivateFaqs/:id', (req, res) => {
    let sql = "call FAQs_activate(?)"
    let params = req.params.id
    putUpdate(req, res, sql, params)
})

router.put('/putDeactivateFaqs/:id', (req, res) => {
    let sql = "call FAQs_deactivate(?)"
    let params = req.params.id
    putUpdate(req, res, sql, params)
})

function deleteQuery(req, res, sql, params){
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql, [params], (err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
            }else{
                if(rs['affectedRows'] == 1){
                    res.status(200).json({"code":1, "message":"Delete Complete"})
                }else{
                    res.status(200).json({"code":0, "message":"Delete Fail"})
                }
            }
        })
    })
}

router.delete('/deleteFaqs/:id', (req, res) => {
    let sql = "call FAQs_delete(?)"
    let params = req.params.id
    deleteQuery(req, res, sql, params)
})

function postInsert(req, res, sql){
    let question = req.body.question
    let answer = req.body.answer
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql, [question, answer], (err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
            }else{
                if(rs['affectedRows'] == 1){
                    res.status(200).json({"code":1, "message":"Insert Complete"})
                }else{
                    res.status(200).json({"code":0, "message":"Insert Fail"})
                }
            }
        })
    })
}

router.post('/postInsert', (req, res) => {
    let sql = "call FAQs_insert(?,?)"
    postInsert(req, res, sql)
})

function putInsert(req, res, sql){
    let id = req.body.id
    let question = req.body.question
    let answer = req.body.answer
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql,[id,question,answer], (err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
            }else{
                if(rs['affectedRows'] == 1){
                    res.status(200).json({"code":1, "message":"Update Complete"})
                }else{
                    res.status(200).json({"code":0, "message":"Update Fail"})
                }
            }
        })
    })
};

router.put('/putInsert', (req, res) => {
    let sql = 'call FAQs_update(?,?,?)'
    putInsert(req, res, sql)
})


module.exports = router