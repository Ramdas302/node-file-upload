const env = {};
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
global.glob = require('glob');
global.validator = require('validatorjs');
global.moment = require('moment');
global.fs = require('fs');
global.path = require('path');
global.jwt = require("jsonwebtoken");
global.bcrypt = require("bcrypt");
global._ = require('lodash');
global.CLSINDEX = { "CONTROLLERS": [] };
global.ROOT_DIR = __dirname;
const dotenv = require('dotenv').config()
global.config = require('./config.js');
const server = express();
server.env = env;
server.use(express.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());
global.Encryption = require('./encrypt-decrypt.js');
const { handleUnknownRoute, handleError} = require('./api/middleware/handleError');
const loggerMiddleware = require('./api/middleware/logging.js');
require('./api/middleware/security')(server, express);
server.use(loggerMiddleware);
fs.readdirSync('./api/controllers/').forEach(function (file) {
  if ((file.indexOf(".js") > 0)) {
      filePath = path.resolve('./api/controllers/' + file);
      clsName = file.replace('.js', '').toUpperCase();
      global[clsName] = require(filePath);
      CLSINDEX.CONTROLLERS.push(clsName);
  }
});

fs.readdirSync('./api/routes/').forEach(function(file) {
    if ((file.indexOf(".js") > 0)) {
        filePath = path.resolve('./api/routes/' + file);
        require(filePath)(server, express);
    }
});

fs.readdirSync('./api/helpers/').forEach(function (file) {
    if ((file.indexOf(".js") > 0)) {
        filePath = path.resolve('./api/helpers/' + file);
        require(filePath)(server, express);
    }
});

server.get("/", function (req, res, next) {
    res.send(" welcome to file upload server");
    return next();
});
server.all('*', handleUnknownRoute);
server.use(handleError);
server.listen(dotenv.parsed.PORT, function () {
    console.log('file upload server started at port ' + dotenv.parsed.PORT);
})