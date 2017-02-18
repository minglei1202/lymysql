var ms = require("./connect.js");
var Q = require("q");
var models = {
	database : function(database){
		ms.database = database;
		return this;
	},
	connect : function(host,user,pwd,port){
		ms.connect(host,user,pwd,port);
		this.conn = ms.conn;
		return this;
	},
	select : function(){
		var deferred = Q.defer();
		if(!this.whereSql){
			deferred.reject("The where sql is wrong!");
			return deferred.promise;
		}
		this.sql = "SELECT " + this.fieldsSql + " FROM " + this.tableName + " " +
					"WHERE " + this.whereSql + " order by " + this.orderSql + " " +
					"limit " + this.limitSql;
		this.conn.query(this.sql,function(err,result){
			if(err){
				deferred.reject(err);
			}else{
				if(!result){
					deferred.reject("Err:No Data!");
				}else {
					deferred.resolve(result[0]);
				}
			}
		})
	},
	add : function(data){
		var deferred = Q.defer();
		if(!data || data.length == 0){
			deferred.reject("The insert data is empty!");
			return deferred.promise;
		}
		var keys = [];
		var values = [];
		for(var i in data){
		keys.push(i);
			values.push("\""+data[i]+"\"");
		}
		this.sql = "INSERT INTO " +
					this.tableName + "(" + keys.join(",") + ")values(" +
					values.join(",") + ")";
		this.conn.query(this.sql,function(err,result){
			if(err){
				deferred.reject(err);
			}else{
				deferred.resolve(result);
			}
		})
		return deferred.promise;
	},
	find : function(){
		var deferred = Q.defer();
		if(!this.whereSql){
			deferred.reject("The where sql is wrong!");
			return deferred.promise;
		}
		this.sql = "SELECT " + this.fieldsSql + " FROM " + this.tableName + " " +
					"WHERE " + this.whereSql + " limit 1";
		this.conn.query(this.sql,function(err,result){
			if(err){
				deferred.reject(err);
			}else{
				if(!result){
					deferred.reject("Err:No Data!");
				}else {
					deferred.resolve(result[0]);
				}
			}
		})
		return deferred.promise;
	},
	fields : function(fields){
		fields = fields || "*";
		this.fieldsSql = fields;
		return this;
	},
	order : function(order){
		order = order || "";
		this.orderSql = order;
		return this;
	},
	where : function(condition){
		if(condition.length == 0){
			console.log("Condition data is empty!");
			return false;
		}
		this.whereSql = this.getWhere(condition);
		return this;
	},
	limit : function(limit,start){
		limit = parseInt(limit);
		start = parseInt(start) || 0;
		if(!limit){
			return this;
		}
		this.limitSql = start + "," + limit;
		return this;
	},
	table : function(tableName){
		this.tableName = tableName;
		return this;
	},
	getLastSql : function(){
		return this.sql;
	},
	getWhere : function(condition){
		var where = [];
		for(var i in condition){
			var item = i;
			if(typeof condition[i] == "object"){
				if(condition[i][0].indexOf(express) == -1 || !condition[i][1]){
					continue;
				}
				item += " " + condition[i][0] + " "+condition[i][1];
				continue;
			}
			item += " = " + condition[i];
			where.push(item);
		}
		return where.join(" AND ");
	},
	fieldsSql : "*",
	orderSql : "",
	limitSql : "0,20"
};
module.exports = models;
