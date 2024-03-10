const security = require('../middleware/security')
const { BadRequest, Unauthorized } = require('../utils/appErrors');
module.exports = function (server, express) {
    server.post("/auth/signup", async (req, res, next) => {
        try {
            var vStatus = new validator(req.body, {
                username: "required",
                password: "required",
                email: "required",
                phone_no: "required",
                password: "required",
                conform_password: "required"
            });
            if (vStatus.fails()) {
                throw new BadRequest(vStatus.errors)
            }
            const data = await USER_AUTH.userSignup(req);
            res.send(data)
        } catch (err) {
            next(err)
        }
    });

    server.post("/auth/login", async (req, res, next) => {
        try {
            var vStatus = new validator(req.body, {
                username: "required",
                password: "required",
            });
            if (vStatus.fails()) {
                throw new BadRequest(vStatus.errors)
            }
            const data = await USER_AUTH.userLogin(req,res);
            res.send(data)
        } catch (err) {
            next(err)
        }
    });

    server.get('/auth/logout', (req, res) => {
        var payload = {
            userid: req.userData.USERID
        }
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 0 })
        res.send('logout successfully');
    });
}