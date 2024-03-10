const { ApplicationError } = require('../utils/appErrors');
module.exports.handleError = (error, req, res, next) => {
    let statusCode = 500;
    if (error instanceof ApplicationError) {
        statusCode = error.getCode();
    }
     res.status(statusCode).send({
        status: "error",
        msg: error.message
    });
    return next();
};

module.exports.handleUnknownRoute = (req, res, next) => {
    res.status(404).send({
        status: "error",
        msg: `path or method not found on this server!`
      });
      return next();
};