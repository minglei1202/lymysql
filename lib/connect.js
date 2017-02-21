var mysql = require("mysql");
var ms = {};
var defaultConfig = {
	host : "localhost",
	user : "root",
	pwd : "",
	prefix : "",
	port : 3306
};
ms.connect = function(config){
	try{
		if((typeof config) != "object"){
			throw "Err:Config is invalid.";
		}
		this.host = config.host || defaultConfig.host;
		this.user = config.user || defaultConfig.user;
		this.pwd  = config.pwd || defaultConfig.pwd;
		this.port = config.port || defaultConfig.port;
		this.prefix = config.prefix || defaultConfig.prefix;

		if(!this.database){
			console.log("Err:No Selected Database.");
		}else{
			this.conn = mysql.createConnection({
				host: this.host,
				user: this.user,
				password: this.pwd,
				database: this.database,
				port: this.port
			});
			this.conn.connect(function (err) {
				if (err) {
					console.log('error when connecting to db:', err);
					setTimeout(this.database(this.database).connect(this.host,this.user,this.pwd,this.port) , 1000);
				}
			});

			this.conn.on('error', function (err) {
				console.log('db error', err);
				// 如果是连接断开，自动重新连接
				if (err.code === 'PROTOCOL_CONNECTION_LOST') {
					this.database(this.database).connect(this.host,this.user,this.pwd,this.port);
				} else {
					throw err;
				}
			});

		}
	}catch(e){
		console.log(e);
	}
	return this;

}
ms.database = function(databaseName){
	this.database = databaseName;
	return this;
}
module.exports = ms;
