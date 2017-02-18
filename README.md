# lymysql
  mysql数据库操作模型<br />
  依赖组件mysql，q<br />
  使用该模型可以进行连贯操作<br />

### 连接数据库
  <pre>
  var lymysql = require("lymysql");
  var model = lymysql.database("database name").connect(host,user,pwd,port);
  </pre>
  
### 增加记录
  <pre>
  model.table("xxx").add({member_id:1});
  </pre>
  
### 查询多条记录
  <pre>
  model.table("xxx").where({id:1}).fields("*").limit(20,0).order("id desc").select();
  </pre>
  
### 查询单条记录
  <pre>
  model.table("xxx").where({id:1}).fields("*").find();
  </pre>
