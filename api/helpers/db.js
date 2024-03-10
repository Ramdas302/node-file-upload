
global._MYSQL = {};
const mysql = require('mysql');
const util = require('util');
module.exports = function (server, express) {
	if (config.dbmysql.enable) {
		const conn = mysql.createConnection(config.dbmysql);
		var query = util.promisify(conn.query).bind(conn);
		console.log("mysql connected")
	} else {
		console.log("mysql is not enable")
	}

	global.db_query = async function (sql) {
		const dbData = await query(sql)
		if (dbData != null && dbData.length <= 0) {
			return ({ status: false, data: dbData });
		}
		return ({ status: true, data: dbData });
	},

		global.db_insertQ1 = async function (table, data) {
			cols = []; quest = [];
			vals = [];
			_.each(data, function (a, b) {
				cols.push(b);
				vals.push(a);
				quest.push("?");
			});

			var sql = "INSERT INTO " + table + " (" + cols.join(",") + ") VALUES (" + quest.join(",") + ")";
			var dbData = await query(sql, vals)
			console.log("dbData:", dbData)
			if (dbData.results != null & dbData.length <= 0) {
				return ({ status: false, data: dbData.Error });
			}
			return ({ status: true, data: dbData.insertId });
		},

		global.db_deleteQ = async function (table, where) {
			sqlWhere = [];
			if (typeof where == "object" && !Array.isArray(where)) {
				_.each(where, function (a, b) {
					if (a == "RAW") {
						sqlWhere.push(b);
					} else if (Array.isArray(a) && a.length == 2) {
						sqlWhere.push(b + a[1] + "'" + a[0] + "'");
					} else {
						sqlWhere.push(b + "='" + a + "'");
					}
				});
			} else {
				sqlWhere.push(where);
			}

			var sql = "DELETE FROM " + table + " WHERE " + sqlWhere.join(" AND ");

			if (config.log_sql) {
				console.log("SQL", sql);
			}

			var dbData = await query(sql)
			console.log("dbData:", dbData)
			if (dbData.results != null & dbData.length <= 0) {
				return ({ status: false, data: dbData.Error });
			}
			return ({ status: true, data: dbData.affectedRows });
		}
}