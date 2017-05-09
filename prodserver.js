/*引入express*/
var express = require('express');
var port = 8002;
var path = require('path');

var runPath = __dirname + '/dist'
/*实例化express*/
var app = express();
app.use(express.static(path.join(__dirname, 'dist')));
/*设置监听端口,同时设置回调函数，监听到事件时执行回调函数*/
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
app.listen(port, function afterListen () {
  console.log('---------------------------------------')
  console.log('express server root path:%s', runPath);
  console.log('express running on the http://localhost:%s', port);
});