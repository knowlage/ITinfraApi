const express = require('express')
const mysql = require('mysql2')
const config = require('../config/config.json')

const router = express.Router()
const conn = mysql.createPool(config.database)

router.get('/',(req, res) => {
    res.end('Software Api')
})


router.get('/getSoftwareBalance', (req, res) => {
    let sql = 'call Software_get_balance'
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql, (err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1, "message":"Access Complete", "data":rs[0]})
                }else{
                    res.status(200).json({"code":0, "message":"Data Not Found"})
                }
            }
        })
    })
})

router.get('/getSoftwareByEmployeenumber/:employeenumber?', (req, res) => {    
    let sql = 'call Software_search_by_employeenumber(?)'
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql,[req.params.employeenumber || ' '],(err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1, "message":"Access Complete", "data":rs[0]})
                }else{
                    res.status(200).json({"code":0, "message":"Data Not Found"})
                }
            }
        })
    })

})

router.get('/getSoftwaresList', (req, res) => {
    let sql = 'call Softwares_get_softwares()'
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql, (err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1, "message":"Access Complete", "data":rs[0]})
                }else{
                    res.status(200).json({"code":0, "message":"Data Not Found."})
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

router.put('/pinDeactivateSoftware/:id', (req, res) => {
    let id = req.params.id
    let sql = 'call Software_deactivate(?)'
    putUpdate(req, res, sql, id)
    
})

router.put('/pinActivateSoftware/:id', (req, res) => {
    let id = req.params.id
    let sql = 'call Software_activate(?)'
    putUpdate(req, res, sql, id)
})

router.delete('/deleteSoftware/:id', (req, res) => {
    let sql = 'call Software_delete(?)'
    let id = req.params.id

    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0, "message":err})
        }
        connection.query(sql, (err, rs, field) => {
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

module.exports = router