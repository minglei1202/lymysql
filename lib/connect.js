var mysql = require("mysql");
var ms = {};
ms.connect = function(host,user,pwd,port){
	this.host = host;
	this.user = user;
	this.pwd  = pwd;
	this.port = port || 6379;
 	if(!this.database){
                console.log("Err:No Selected Database.");
        }else{
		this.conn = mysql.createConnection({
    			host: localhost,
    			user: user,
    			password: pwd,
    			database: ms.database,
    			port: 3306
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
	return this;

}
ms.database = function(databaseName){
	this.database = databaseName;
	return this;
}
module.exports = ms;
