// loggerMiddleware.js
const logLevels = {
    warn: 'WARNING',
    info: 'INFO',
    error: 'ERROR'
};

const customLogger = (level, message) => {
    const dir_name = `./logs/${moment().format('YYYY-MM-DD')}`;
    if (!fs.existsSync(dir_name)) {
        fs.mkdirSync(dir_name, { recursive: true });
    }
    const file_name = `${dir_name}/log.txt`;
    fs.appendFileSync(file_name, `[${new Date().toISOString()}] ${logLevels[level]}: ${message}\n`);
};

const loggerMiddleware = (req, res, next) => {
    req.log = {};
    Object.keys(logLevels).forEach(level => {
        req.log[level] = (message) => customLogger(level, message);
    });
    next();
};

module.exports = loggerMiddleware;
