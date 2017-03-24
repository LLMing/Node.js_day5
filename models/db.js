/**
 * Created by llming on 2017/3/20.
 */
//这个模块里面封装了所有对数据库的常用操作
var MongoClient = require("mongodb").MongoClient;
var settings = require("../settings.js");
var assert = require("assert");

//将连接数据库操作封装成为函数
function _connectDB(callback) {
    //从settings文件中读取url地址
    var url = settings.dbURL;
    //连接数据库
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("连接成功!");
        callback(err, db);
    });
}

//插入数据
exports.insertOne = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        assert.equal(null, err);
        db.collection(collectionName).insertOne(json, function (err, result) {
            assert.equal(null, err);
            callback(err, result);
            db.close();
        });
    });
};

//查找数据,找到所有数据
exports.find = function (collectionName, json, C, D) {
    if (arguments.length == 3) {
        //如果只传了3个参数,那么参数C就是callback,参数D就没有
        //noinspection JSDuplicatedDeclaration
        var callback = C;
        var skipnumber = 0;
        var limit = 0;
    } else if (arguments.length == 4) {
        //noinspection JSDuplicatedDeclaration
        var callback = D;
        //noinspection JSDuplicatedDeclaration
        var args = C;
        // 应该省略的条数
        var skipnumber = args.pageamount * args.page || 0;
        //数目限制
        var limit = args.pageamount || 0;
        //排序
        var sort = args.sort || {};
    } else {
        throw new Error("find函数的参数个数必须是3个或者4个");
    }

    _connectDB(function (err, db) {
        assert.equal(null, err);
        db.collection(collectionName).find(json).limit(limit).skip(skipnumber).sort(sort).toArray(function (err, docs) {
            assert.equal(null, err);
            callback(err, docs);
            db.close();
        });
    });
};

//删除操作
exports.deleteMany = function (collectionName, json, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).deleteMany(json, function (err, result) {
            callback(err, result);
            db.close();
        });
    });
};

//修改数据
exports.updateMany = function (collectionName, json1, json2, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).updateMany(json1, json2, function (err, result) {
            callback(err, result);
            db.close();
        });
    });
};

//获取数据数量
exports.getAllCount = function (collectionName, callback) {
    _connectDB(function (err, db) {
        db.collection(collectionName).count({}).then(function (count) {
            callback(count);
            db.close();
        });
    });
};