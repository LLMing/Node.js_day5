/**
 * Created by llming on 2017/3/20.
 */
var express = require("express");
var MongoClient = require("mongodb").MongoClient;

var app = express();

app.get("/", function (req, res) {
    var url = "mongodb://127.0.0.1:27017/llming";
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return console.log("数据库连接失败");
        }
        console.log("数据库连接已建立");

        //插入数据,集合如果不存在,也没有关系,会自动创建
        db.collection("student").insertOne({
            "name": "哈哈",
            "age": parseInt(Math.random() * 100 + 10)
        }, function (err, result) {
            //插入之后做的事情,result表示插入结果
            console.log(result);
            db.close();
            res.send(result);
        });
    });
});

app.listen(3000);