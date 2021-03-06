const express = require('express')
const mysql = require('mysql2')
const config = require('../config/config.json')

const router = express.Router()
const conn = mysql.createPool(config.database)

router.get('/',(req, res) => {
    res.end('Dashboard Api')
})

router.get('/getComputers', (req, res) => {
    let sql = 'call Dashboard_computer_summary()'
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,(err,rs,field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length >0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"Data Not Found"})
                }
            }
        })
    })
})

router.get('/getComputerInstock', (req, res) => {
    let sql = 'call Dashboard_computer_instock()'
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql, (err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0, "message":"Data Not Found"})
                }
            }
        })
    })
})

router.get('/getComputerBorrow', (req,res) => {
    let sql = 'call Dashboard_computer_special_project_20nb()'
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

router.get('/getSoftwares', (req, res) => {
    let sql = 'call Dashboard_software_summary()'
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

router.get('/getSoftwareBalance', (req, res) => {
    let sql = 'call Dashboard_software_balance()'
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

module.exports = router