/**
 * Created by llming on 2017/3/24.
 */
var express = require("express");
var db = require("./models/db.js");
var session = require("express-session");
var crypto = require("crypto");
var app = express();

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
}));

app.set("view engine", "ejs");

app.get("/",function (req, res) {
    if(req.session.login){
        res.send("欢迎"+req.session.username);
    }else {
        res.send("没有登陆");
    }
});

app.get("/login", function (req, res) {
    res.render("denglu");
});

app.get("/checklogin", function (req, res) {
    var inputusername = req.query.username;
    var inputpassword = req.query.password;
    var hashpassword = crypto.createHash("md5").update(inputpassword).digest("hex");
    console.log(hashpassword);
    //根据用户填写的姓名,去数据库里面找这个文档,读取密码
    //如果读取的密码,和填写的密码一样,登陆成功
    //否则,登录失败
    db.find("users", {"username": inputusername}, function (err, result) {
        if (result.length == 0) {
            return res.send("登录名错误");
        }
        var mongopassword = result[0].password;
        if (hashpassword == mongopassword) {
            req.session.login = true;
            req.session.username = inputusername;
            res.send("成功登陆,你是" + result[0].username);
        } else {
            res.send("密码错误");
        }
    });
});

app.listen(3000);