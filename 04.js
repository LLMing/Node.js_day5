/**
 * Created by llming on 2017/3/21.
 */
var express = require("express");
var cookieParse = require("cookie-parser");

var app = express();
// 使用cookie,必须使用cookieParse()中间件
app.use(cookieParse());

app.get("/",function (req, res) {
    res.cookie("xihao","tfboy",{maxAge : 900000,httpOnly : true});
    res.send("猜你喜欢"+req.cookies.mudidi);
});

app.get("/gonglue",function (req, res) {
    //得到get请求,用户查询的目的地
    var mudidi = req.query.mudidi;
    //记录用户的喜好
    //先读取用户的喜好,然后把新的数据push进入数组
    var mudidiarray = req.cookies.mudidi || [];
    mudidiarray.push(mudidi);
    res.cookie("mudidi",mudidiarray,{maxAge : 900000,httpOnly : true});
    res.send(mudidi+"旅游攻略");
});

app.listen(3000);