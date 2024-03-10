const fs = require('fs').promises;
module.exports = {
    fileUpload: async function (req) {
        if (req.file) {
            var file_data = {
                username: req.userData.USERID,
                file_type: req.file.mimetype,
                file_name: req.file.filename,
                file_path: req.file.path,
                created_on: moment().format("YYYY-MM-DD HH:mm:ss"),
                edited_on: moment().format("YYYY-MM-DD HH:mm:ss"),
            };
            var fileData = await db_insertQ1("user_files", file_data);
            if (fileData.status && fileData.data) {
                req.log.info('file upload successfully');
                return ({ status: "success", msg: 'file successfully uploaded', data: fileData.data })
            } else {
                return ({ status: "error", msg: fileData.data, data: "" })
            }
        } else {
            req.log.error('file not found');
            return ({ status: "error", msg: "file not found", data: "" })
        }
    },

    removeFile: async function (fileData) {
        let dbQuery = `SELECT * FROM user_files WHERE username = '${fileData.userid}' AND id IN (${fileData.filearray.join(',')})`
        var findFile = await db_query(dbQuery);
        if (!findFile.status) {
            return ({ status: "error", msg: 'file id not found', data: "" })
        }
        let dirPath = `./public/${fileData.userid}`;
        const files = await fs.readdir(dirPath);
        for (const file of files) {
            const foundFile = findFile.data.find(ele => ele.file_name === file);
            if (foundFile) {
                const curPath = path.join(dirPath, file);
                if ((await fs.lstat(curPath)).isDirectory()) {
                    await removeDirectory(curPath)
                } else {
                    await fs.unlink(curPath);
                }
                var fileRemove = await db_deleteQ("user_files", { "id": foundFile.id });
                if (!fileRemove.status) {
                    return ({ status: "error", msg: fileRemove.data, data: "" })
                }
            }
        }
        return ({ status: "success", msg: "file deleted successfully" })
    },

    fileList: async function (userid) {
        let dbQuery = `SELECT * FROM user_files WHERE username = '${userid}'`
        var fileData = await db_query(dbQuery);
        if (!fileData.status) {
            return ({ status: "error", data: fileData.data })
        } else {
            return ({ status: "success", data: fileData.data })
        }
    },

    fileSearch: async function (fileData) {
        try {
            let directory = `./public/${fileData.userid}`;
            const files = await fs.readdir(directory);
            var fileList = []

            for (const file of files) {
                const filePath = path.join(directory, file);
                const fileStat = await fs.stat(filePath);

                if (fileStat.isDirectory()) {
                } else if (file.match(fileData.searchPattern)) {
                    fileList.push(filePath);
                }
            }
            return fileList;
        } catch (error) {
            return next(error)
        }
    },
}