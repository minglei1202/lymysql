# lymysql
  mysql数据库操作模型

  依赖组件mysql，q

  使用该模型可以进行连贯操作

示例

```
model.table("xxx").where({id:1}).fields("*").limit(20,0).order("id desc").select();
```

### 连接数据库

连接mysql之前，先设置数据库库，如下:

  ```
  var lymysql = require("lymysql");
  var model = lymysql
	.database("database name")
	.connect({
		host:host,
		user:user,
		pwd:pwd,
		port:port
	});
  ```
  
### 增加记录

params为json

  ```
  add(params);
  ```
  
  
### 增加多条记录

params为json数组

  ```
  addAll(params);
  ```
  
### 查询多条记录

  ```
  select();
  ```
  
### 查询单条记录

  ```
  find();
  ```

### 返回字段

field默认是“*”，多个以“,”给开

  ```
  fields(field);
  ```
 
### 联合查询

tableName 表名

condition 关联条件

```
join(tableName).on(condition)
```

### 设置结果行数

limit 返回数据行数

offset 跳过行数，默认是0

```
limit(limit,offset)
```

### 返回上一次执行的sql语句

```
getLastSql()
```