# lymysql
  mysql数据库操作模型<br />
  依赖组件mysql，q<br />
  使用该模型可以进行连贯操作<br />

## 连接数据库
  <pre>
  var lymysql = require("lymysql");
  var model = lymysql.database("database name").connect(host,user,pwd,port);
  </pre>
  
## 增加记录
  <pre>
  model.table("xxx").where({id:1}).fields("*").find();
  </pre>
