const express = require('express')
const jwt = require('jsonwebtoken')
const loginLdapMiddleware = require('../middlewares/loginLdapMiddleware')
const config = require('../config/config.json')
const mysql = require('mysql2')


const router = express.Router()
const conn = mysql.createPool(config.database)

// loginLdapMiddleware
router.post("/login", (req, res) => {
  getUserRole(req.body.username)
  .then(rs => {
    let token = jwt.sign(
      {
        sub: req.body.username,
        role: rs
      },
      config.auth.secret_key,
      { expiresIn: 60 * 60 * 2 }
    );
    res.status(200).json({"code":1,"message":"generate token success","token":token});
  })
  .catch((err) => {
    res.status(500).json({"code":0,"message":err});
  })
  
});

var getUserRole = (user_id) => {
  return new Promise((resolve, reject) => {
    let sql = 'call UserRole_get_userrole(?)'
    conn.getConnection((err, connection) => {
      if(err){
        reject(err)
      }
      connection.query(sql,[user_id],(err,rs,field) => {
        connection.release()
        if(err){
          reject(err)
        }else{
          if(rs[0].length > 0){
            resolve(rs[0][0]['role_name'])
          }else{
            resolve('registered')
          }
          
        }
      })
    })
  })
}


module.exports = router