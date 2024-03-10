require('dotenv').config();
const { Unauthorized, BadRequest, Conflict } = require('../utils/appErrors');
const multer = require("multer");
module.exports.localUpload = (req, res, next) => {
    try {
        var dir_name = `./public/${req.userData.USERID}`;
        if (!fs.existsSync(dir_name)) {
            fs.mkdirSync(dir_name);
        }
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, dir_name);
            },
            filename: function (req, file, cb) {
                cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
            }
        });

        const fileFilter = function (req, file, cb) {
            const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf', '.txt', '.deb', '.zip'];
            const extname = path.extname(file.originalname).toLowerCase();
            if (!allowedFileTypes.includes(extname)) {
                return cb(new BadRequest('Only .png, .jpg and .jpeg .pdf .txt format allowed!'));
            }
            if (file.size > process.env.fileMaxSize) {
                return next(new BadRequest('File too large'));
            }
            cb(null, true);
        };

        const upload = multer({
            storage: storage,
            fileFilter: fileFilter
        }).single('file');

        upload(req, res, function (err) {
            if (err) {
                return next(err);
            }
            return next();
        });
    } catch (err) {
        return next(err)
    }
};
