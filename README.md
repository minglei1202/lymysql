# lymysql
mysql数据库操作模型
依赖组件mysql，q
  使用该模型可以进行连贯操作
  比如：model->table("xxx")->where({id:1})->fields("*")->find()
