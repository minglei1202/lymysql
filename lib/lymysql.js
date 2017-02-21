var ms = require("./connect.js");
var Q = require("q");
var limitSql = "0,20";
var models = {
	database : function(database){
		ms.database = database;
		return this;
	},
	connect : function(config){
		ms.connect(config);
		this.conn = ms.conn;
		this.prefix = ms.prefix;
		return this;
	},
	select : function(){
		var deferred = Q.defer();
		if(!this.whereSql){
			deferred.reject("The where sql is wrong!");
			models.init();
			return deferred.promise;
		}
		this.sql = buildSelectSql(this.limitSql);
		this.conn.query(this.sql,function(err,result){
			if(err){
				deferred.reject(err);
			}else{
				if(!result){
					deferred.reject("Err:No Data!");
				}else {
					deferred.resolve(result);
				}
			}
			models.init();
		})
		return deferred.promise;
	},
	add : function(data){
		var deferred = Q.defer();
		if(!data || data.length == 0){
			deferred.reject("The insert data is empty!");
			models.init();
			return deferred.promise;
		}
		this.sql = buildInsertSql([data]);
		this.conn.query(this.sql,function(err,result){
			if(err){
				deferred.reject(err);
			}else{
				deferred.resolve(result);
			}
			models.init();
		})
		return deferred.promise;
	},
	addAll : function(data){
		var deferred = Q.defer();
		if(!data || data.length == 0){
			deferred.reject("The insert data is empty!");
			models.init();
			return deferred.promise;
		}
		this.sql = buildInsertSql(data);
		if(!this.sql){
			deferred.reject("The Sql is wrong!");
			models.init();
			return deferred.promise;
		}
		this.conn.query(this.sql,function(err,result){
			if(err){
				deferred.reject(err);
			}else{
				deferred.resolve(result);
			}
			models.init();
		})
		return deferred.promise;
	},
	update : function(data){
		var deferred = Q.defer();
		this.sql = buildUpdateSql(data);
		if(!this.sql){
			deferred.reject("The Sql is wrong!");
			models.init();
			return deferred.promise;
		}
		this.conn.query(this.sql,function(err,result){
			if(err){
				deferred.reject(err);
			}else{
				deferred.resolve(result);
			}
			models.init();
		})
		return deferred.promise;
	},
	find : function(){
		var deferred = Q.defer();
		if(!this.whereSql){
			deferred.reject("The where sql is wrong!");
			models.init();
			return deferred.promise;
		}
		this.limitSql = "0,1";
		this.sql = buildSelectSql();
		this.conn.query(this.sql,function(err,result){
			if(err){
				deferred.reject(err);
			}else{
				if(!result){
					deferred.reject("Err:No Data!");
				}else {
					deferred.resolve(result[0]);
				}
				models.init();
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
	join : function(tableName,type){
		type = type || "LEFT";
		this.joinSql += type + " JOIN " + tableName; 
		return this;
	},
	on : function(conditionStr){
		this.joinSql += " ON " + conditionStr;
		return this;
	},
	table : function(tableName){
		this.tableName = this.prefix + tableName;
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
	init : function(){
		this.limitSql = limitSql;
		this.fieldsSql = "*";
		this.joinSql = "";
	},
	fieldsSql : "*",
	orderSql : "",
	limitSql : limitSql,
	joinSql : ""
};

/**
 * 构建查询sql语句
 */
function buildSelectSql(){
	var sql = "SELECT " + models.fieldsSql + " FROM " + models.tableName;
	if(models.joinSql){
		sql += " " + models.joinSql;
	}
	if(models.orderSql){
		sql += " ORDER BY " + models.orderSql;
	}
	sql += " WHERE " + models.whereSql + " limit " + models.limitSql;
	return sql;
}

/**
 * 构建insert sql语句
 */
function buildInsertSql(data){
	var keys = [];
	var values = [];
	var sql = "";
	if(data.length == 0){
		return sql;
	}
	for(var i in data){
		for(var j in data[i]){
			keys.push(j);
		}
		break;
	}
	sql += "INSERT INTO " + models.tableName + "(" + keys.join(",") + ")";
	for(var i in data){
		var tempValues = [];
		for(var j in data[i]){
			tempValues.push("\""+data[i][j]+"\"");
		}
		values.push("(" + tempValues.join(",") + ")");
	}
	sql += "values" + values.join(",");
	return sql;
}

/**
 * 构建更新 sql语句
 */
function buildUpdateSql(data){
	var setArr = [];
	var sql = "";
	if(data.length == 0){
		return sql;
	}
	for(var i in data){
		setArr.push(i + " = \"" + data[i] + "\"");
	}
	sql += "UPDATE " + models.tableName + " set " + setArr.join(",") + " WHERE " + models.whereSql;
	return sql;
}

module.exports = models;
