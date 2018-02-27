/**
 * Created by Administrator on 2017/10/26.
 */
let user = require('./User.js');

console.log(`userName:${user.userName}`);

exports.userName = "Tom";
exports.sayHello = function () {
  return "hello";
}

let http=require('http');
let url=require("url");
let util =require("util");
let server=http.createServer(function (req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type","text/plain;charset=utf-8");
  console.log("url:"+req.url);
  res.end(util.inspect(url.parse("http://localhost:3000/demo.html/userName?a=123")));
});
server.listen(3000,'127.0.0.1',()=> {
  console.log("服务器已经运行");
});
