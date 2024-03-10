require('dotenv').config()
const { Unauthorized } = require('../utils/appErrors');
module.exports = function (server) {
  server.use(function (req, res, next) {
    //req._url.path
    const pathVar = req.originalUrl.split("/");

    //console.log("REQ_URL", req.path());
    if (config.NOAUTH.indexOf(req.originalUrl) >= 0 || config.NOAUTH.indexOf("/" + pathVar[1]) >= 0) {
      return next();
    }
     const jwtToken = req.headers['auth-token']
    if (jwtToken == null) {
      throw new Unauthorized("Auth Token Invalid")
    }
    try {
      console.log(jwtToken)
      const decoded = jwt.verify(jwtToken,process.env.SECRET_KEY);
      req.userData = decoded;
      let userId = req.userData.USERID
      req.get(`${userId}`)
      return next();
    } catch (err) {
      throw new Unauthorized("Session Expired, try login again")
    }
  })
}