const { localUpload } = require('../middleware/handleUpload');
const { BadRequest } = require('../utils/appErrors');
module.exports = function (server, express) {

    server.post("/user/uploadfile", localUpload, async (req, res, next) => {
        try {
            const data = await FILE_UPLOAD.fileUpload(req);
            res.send(data)
        } catch (err) {
            next(err)
        }
    });

    server.post("/user/deletefile", async (req, res, next) => {
        try {
            var vStatus = new validator(req.body, {
                filearray: "required",
            });
            if (vStatus.fails()) {
                throw new BadRequest(vStatus.errors)
            }
            let fileData = {
                filearray: req.body.filearray,
                userid: req.userData.USERID
            }
            const data = await FILE_UPLOAD.removeFile(fileData);
            res.send(data)
        } catch (err) {
            next(err)
        }
    });

    server.get("/user/filelist", async (req, res, next) => {
        try {
            const data = await FILE_UPLOAD.fileList(req.userData.USERID);
            res.send(data)
        } catch (err) {
            next(err)
        }
    });

    server.post("/user/filesearch", async (req, res, next) => {
        try {
            var vStatus = new validator(req.body, {
                search_file: "required",
            });
            if (vStatus.fails()) {
                throw new BadRequest(vStatus.errors)
            }
            var fileData = {
                userid: req.userData.USERID,
                searchPattern: req.body.search_file
            }
            const data = await FILE_UPLOAD.fileSearch(fileData);
            res.send(data)
        } catch (err) {
            next(err)
        }
    });
}