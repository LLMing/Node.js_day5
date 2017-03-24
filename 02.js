/**
 * Created by llming on 2017/3/20.
 */
var express = require("express");
var db = require("./models/db.js");

var app = express();

//使用db模块插入数据
//插入数据页面
app.get("/", function (req, res) {
    db.insertOne("teacher", {"name": "WY"}, function (err, result) {
        if (err) {
            return console.log("插入失败");
        }
        res.send("插入成功:" + result);
    });
});

//读取数据页面
app.get("/du", function (req, res) {
    //页面接收一个page参数
    var page = parseInt(req.query.page);

    db.find("student", {"age": {$gt: 18}}, {"pageamount": 5, "page": page}, function (err, docs) {
        if (err) {
            return console.log(err);
        }
        res.json({"docs": docs});
    });
});

//删除数据页面
app.get("/delete", function (req, res) {
    var name = req.query.name;
    db.deleteMany("student", {"name": name}, function (err, result) {
        if (err) {
            return console.log(err);
        }
        res.send(result);
    });
});

//修改数据页面
app.get("/update", function (req, res) {
    db.updateMany("student", {
        "name": "小红"
    }, {
        $set: {"age": 88},
        $currentDate: {"lastModified": true}
    }, function (err, result) {
        if (err) {
            return console.log(err);
        }
        res.send(result);
    });
});

app.listen(3000);