module.exports = {
	dbmysql: {
		enable: true,
		host: 'nodedatabase.c1kee26w6ixi.ap-south-1.rds.amazonaws.com',
		port: 3306,
		user: 'admin',
		password: 'Ramdas3320',
		database: 'upload',
	},
	NOAUTH: [
        "/auth/signup",
        "/auth/login",
        "/test",
        "/"
    ],
};
