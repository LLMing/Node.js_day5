/**
 * Created by llming on 2017/3/20.
 */
//留言本
var express = require("express");
var db = require("./models/db.js");
var formidable = require("formidable");
var ObjectId = require("mongodb").ObjectID;

var app = express();

app.set("view engine", "ejs");

//静态
app.use(express.static("./public"));

app.get("/", function (req, res) {
    db.getAllCount("message",function (count) {
        //增加留言
        res.render("index",{
            "pageamount" : Math.ceil(count/4)
        });
    });
});

//读取留言
app.get("/du", function (req, res) {
    var page= parseInt(req.query.page);
    db.find("message", {},{"sort":{"shijian":-1},"pageamount":4,"page":page}, function (err, result) {
        res.json({"result": result});
    });
});

//处理留言
app.post("/tijiao", function (req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {
        //写入数据库
        db.insertOne("message", {
            "xingming": fields.xingming,
            "liuyan": fields.liuyan,
            "shijian": new Date()
        }, function (err, result) {
            if (err) {
                return res.json({"result": -1});
            }
            res.json({"result": 1});
        });
    });
});

//删除
app.get("/shanchu",function (req, res) {
    //得到参数
    var id = req.query.id;
    db.deleteMany("message",{"_id":ObjectId(id)},function (err, result) {
       res.redirect("/");
    });
});

app.listen(3000, "172.17.106.148");