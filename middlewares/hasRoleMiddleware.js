
const jwt = require('jsonwebtoken')
const config = require('../config/config.json')


var checkRole = (decoded, role) => {
    return new Promise((resolve, reject) => {
        if(role.includes(decoded.role)){
            resolve(true)
        }else{
            reject()
        }
    })
}

module.exports = (role) => {    
    return (req,res,next) => {
        try{            
            var decoded = jwt.verify(req.headers.authorization,config.auth.secret_key)
            checkRole(decoded, role)
            .then(rs => {
                if(rs){
                    next()
                }
            })            
            .catch(() => {
                res.status(401).json({"code":0,"message":"Unauthorized"})
            })           
 
        }catch (err) {
            res.status(401).json({"code":0,"message":err});
        }            
    }
}