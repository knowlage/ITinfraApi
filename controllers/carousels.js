const express = require('express')
const mysql = require('mysql2')
const config = require('../config/config.json')


const router = express.Router()
const conn = mysql.createPool(config.database)


router.get('/',(req,res) => {
    res.end('carousel api')
})

router.get('/getCarousels',(req,res) => {
    let sql = 'call Carousel_get_carousel_news()'
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,(err,rs) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"Carousel Not Found"})
                }
            }
        })
    })
})

router.get('/getCarouselsAll', (req, res) => {
    let sql = 'call Carousel_get_carousel_news_all()'
    conn.getConnection((err,connection) => {
        if(err){
            res.status(400).json({"code":0,"message":err})
        }
        connection.query(sql,(err,rs) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0,"message":err})
            }else{
                if(rs[0].length > 0){
                    res.status(200).json({"code":1,"message":"Access Complete","data":rs[0]})
                }else{
                    res.status(200).json({"code":0,"message":"Carousel Not Found"})
                }
            }
        })
    })
})

function putUpdate(req, res, sql, params){
    conn.getConnection((err, connection) => {
        if(err){
            res.status(400),json({"code":0, "message":err})
        }
        connection.query(sql, [params], (err, rs, field) => {
            connection.release()
            if(err){
                res.status(400).json({"code":0, "message":err})
            }else{
                if(rs['affectedRows'] == 1){
                    res.status(200).json({"code":1, "message":"Update Success"})
                }else{
                    res.status(200).json({"code":0, "message":"Update Fail"})
                }
            }
        })
    })
}

router.put('/putCarouselPinActivate/:id', (req, res) => {
    let id = req.params.id
    let sql = 'call Carousel_pin_activate(?)'
    putUpdate(req, res, sql, id)
})

router.put('/putCarouselPinDeactivate/:id', (req, res) => {
    let id = req.params.id
    let sql = 'call Carousel_pin_deactivate(?)'
    putUpdate(req, res, sql, id)
})

router.put('/putCarouselActivate/:id', (req, res) => {
    let id = req.params.id
    let sql = 'call Carousel_activate(?)'
    putUpdate(req, res, sql, id)
})

router.put('/putCarouselDeactivate/:id', (req, res) => {
    let id = req.params.id
    let sql = 'call Carousel_deactivate(?)'
    putUpdate(req, res, sql, id)
})

module.exports = router