/*引入express*/
var express = require('express');
var port = 8001;
var path = __dirname + '/dist'

/*实例化express*/
var app = express();
app.use('/', express.static(path))
/*设置监听端口,同时设置回调函数，监听到事件时执行回调函数*/

app.listen(port, function afterListen () {
  console.log('---------------------------------------')
  console.log('express server root path:%s', path);
  console.log('express running on the http://localhost:%s', port);
});