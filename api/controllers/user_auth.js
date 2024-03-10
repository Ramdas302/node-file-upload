const { NotFound, BadRequest, Unauthorized, Conflict } = require('../utils/appErrors');
const crypto = require('crypto');
module.exports = {
    userSignup: async function (req) {
        var dataParams = req.body
        if (dataParams.password === dataParams.conform_password) {
            let dbQuery = `SELECT username FROM users WHERE username = '${dataParams.username}'`
            var findUser = await db_query(dbQuery);
            if (findUser.status && findUser.data.length > 0) {
                throw new Conflict('This user is already in use!')
                //return ({ status: "error", msg: 'This user is already in use!', data: findUser.data[0] })
            } else {
                var hash = await bcrypt.hash(dataParams.password, 10);
                var userdata = {
                    user_role: "user",
                    username: dataParams.username != undefined ? dataParams.username : "",
                    email: dataParams.email != undefined ? dataParams.email : "",
                    phone: dataParams.phone_no != undefined ? dataParams.phone_no : "",
                    pwd: hash,
                    conform_password: hash,
                    created_on: moment().format("YYYY-MM-DD HH:mm:ss"),
                    edited_on: moment().format("YYYY-MM-DD HH:mm:ss"),
                };
                var registerData = await db_insertQ1("users", userdata);
                if (registerData.status && registerData.data) {
                    req.log.info('user successfully register');
                    return ({ status: "success", msg: 'user successfully register', data: registerData.data })
                } else {
                    return ({ status: "error", msg: registerData.data, data: "" })
                }
            }
        } else {
            throw new BadRequest('password and conform_password do not match')
        }
    },

    userLogin: async function (req, res) {
        var dataParams = req.body
        let dbQuery = `SELECT username,pwd,blocked,created_on FROM users WHERE username = '${dataParams.username}'`
        var findUser = await db_query(dbQuery);
        if (!findUser.status) {
            throw new Unauthorized('user not found')
        } else {
            var bResult = await bcrypt.compare(
                dataParams.password,
                findUser.data[0].pwd
            );
            if (!bResult) {
                throw new Unauthorized('password is incorrect')
            } else {
                if (findUser.data[0].blocked == "true") {
                    return ({ status: "error", msg: "user are blocked", data: findUser.data[0] });
                } else {
                    const accessToken = jwt.sign(
                        { USERID: findUser.data[0].username },
                        process.env.SECRET_KEY,
                        { expiresIn: process.env.JWT_EXPIRE }
                    );
                    const refreshToken = jwt.sign(
                        { USERID: findUser.data[0].username },
                        process.env.SECRET_KEY,
                        {}
                    );
                    res.cookie('auth-token', accessToken, { httpOnly: true });
                    res.cookie('refresh-token', refreshToken, { httpOnly: true });
                    return ({
                        status: "success",
                        token: accessToken,
                        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
                        userid: findUser.data[0].username,
                    });

                }
            }
        }
    }
}