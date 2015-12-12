var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

port = process.env.PORT || 3000;

app.get('/', function(req, res){
    res.sendfile('node.html');
});

http.listen(port,function(){
    console.log("Express server listening on port " + port);
});

io.on('connection',function(socket){
    // 接続通知をクライアントに送信
    io.emit('sendMessageToClient',{value:'１人入室しました'});

    // クライアントからの受信イベントを設定
    socket.on('sendMessageToServer',function(data){
        io.emit('sendMessageToClient',{value:data.value});
    });

    // 接続切れイベントを設定
    socket.on('disconnect',function(){
        io.emit('sendMessageToClient',{value:'１人退室しました'});
    });
});
