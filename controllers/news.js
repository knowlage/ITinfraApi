const express = require('express')
const mysql = require('mysql2')
const config = require('../config/config.json')

const router = express.Router()
const conn = mysql.createPool(config.database)

router.get('/',(req,res) => {
    res.end('news api')
})

router.get('/getnewsall', (req,res) => {
    let sql = 'call News_get_news_all()'
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
                    res.status(200).json({"code":0,"message":"News Not Found"})
                }
            }
        })
        
    })
})

router.get('/getnews',(req,res) => {
    let sql = 'call News_get_news()'
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
                    res.status(200).json({"code":0,"message":"News Not Found"})
                }
            }
        })
    })

})

router.get('/getNewsSearch/:search?',(req,res) => {
    let sql = 'call News_search(?)'
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,[req.params.search || ' '],(err,rs,field) => {
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"News Not Found"})
                }
            }
        })
    })
})

router.get('/getNewsFeature',(req,res) => {
    let sql = 'call News_get_news_feature()'
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
                    res.status(200).json({"code":0,"message":"News Not Found"})
                }
            }
        })
    })
})

router.put('/putActivateNews/:id', (req,res) => {
    let sql = "call News_activate(?)"
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql,[req.params.id],(err,rs,field) => {
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
})

router.put('/putDeactivateNews/:id', (req,res) => {
    let sql = "call News_deactivate(?)"
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql,[req.params.id],(err,rs,field) => {
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
})

function putUpdate(req, res, sql, params){
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql,[params], (err, rs, field) => {
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

function deleteNews(req,res,sql,params) {
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql,[params],(err,rs,field) => {
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

router.put('/putPinActivateNews/:id', (req,res) => {
    let sql = "call News_pin_activate(?)"
    putUpdate(req, res, sql, req.params.id)
})

router.put('/putPinDeactivateNews/:id', (req,res) => {
    let sql = 'call News_pin_deactivate(?)'
    putUpdate(req, res, sql, req.params.id)
})

router.delete('/deleteNews/:id', (req,res) => {
    let sql = 'call News_delete(?)'
    deleteNews(req,res,sql,req.params.id)
})

module.exports = router