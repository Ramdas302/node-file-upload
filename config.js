module.exports = {
	dbmysql: {
		enable: true,
		host: 'localhost',
		port: 3306,
		user: 'root',
		password: 'password@123',
		database: 'upload',
	},
	NOAUTH: [
        "/auth/signup",
        "/auth/login",
        "/test",
        "/"
    ],
};
