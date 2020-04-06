const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const config = require('../config/config.json')

const conn = mysql.createConnection(config.database)

var getUserRole = (decoded) => {    
    return new Promise((resolve,reject) => {
        let sql = 'call UserRole_get_userrole(?)'
        conn.query(sql,decoded.sub,(err,rs) => {
            if(err){
                return reject(err)
            }else{             
                resolve(rs[0])
            }
        })
    })
}

module.exports = (role) => {
    var state = 0
    return (req,res,next) => {
        try{            
            var decoded = jwt.verify(req.headers.authorization,config.auth.secret_key)
            getUserRole(decoded)
            .then(rs => {   
               if(rs.length){
                   rs.forEach((_rs) => {
                       if(role.includes(_rs.role_name)){
                           state = 1
                       }
                   })
               }                  
            })
            .then(() => {
                if(state == 1){
                    next()
                }else{
                    res.status(401).json({"code":0,"message":"Unauthorized"})
                }
            })
            .catch((err) => {
                res.status(500).json({"code":0,"message":err});
            })
            
        }catch (err) {
            res.status(401).json({"code":0,"message":err});
        }            
    }
}