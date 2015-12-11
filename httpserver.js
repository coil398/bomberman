var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.sockets.on('connection',function(socket){
    socket.on('message',function(data){
        socket.broadcast.emit('message',data);
        socket.emit('message',data);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
