const ldap = require('ldapjs')
const config = require('../config/config.json')

module.exports = (req, res, next) => {   
  let client = ldap.createClient({
    url: "ldap://" + config.ldap.url
  });

  client.bind(
    "uid=" + req.body.username + ",ou=people,o=cattelecom,c=th",req.body.password,(err) => {
      if (err) {
        res.status(401).json({"code":0,"message":"Login Error"});
      } else {
        next();
      }
      client.unbind();
    }
  );
};

