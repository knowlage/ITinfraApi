const express = require('express')
const jwt = require('jsonwebtoken')
const loginLdapMiddleware = require('../middlewares/loginLdapMiddleware')
const config = require('../config/config.json')


const router = express.Router()



router.post("/login",loginLdapMiddleware, (req, res) => {
  let token = jwt.sign(
    {
      sub: req.body.username
    },
    config.auth.secret_key,
    { expiresIn: 60 * 60 * 2 }
  );
  res.status(200).json({"code":1,"message":"generate token success","token":token});
});

module.exports = router