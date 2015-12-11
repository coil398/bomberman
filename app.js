var express = require('express'),
    path = require('path'),
    Room_api = require('./routes/room');

var app = express();
var server = require('http').createServer(app);

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    /*
    app.use(express.logger('dev'));
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
    */
});

server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);




// APIs for /room
app.get('/',function(req,res){
    res.sendfile('index.html');
});
app.get('/room/index',Room_api.get_list);
app.post('/room/create',Room_api.create);
app.post('/room/debug',Room_api.debug);
app.post('/room/enter',Room_api.enter);
app.post('/room/leave',Room_api.leave);
//app.post('/room/out',Room_api.out);
app.delete('/room/deletetable',Room_api.deletetable);

io.sockets.on('connection',function(socket){

    socket.on('C_to_S_message',function(data){
        io.sockets.emit('S_to_C_message',{value:'beep_test'});
    });

    socket.on('beep',function(data){
        io.sockets.emit('S_to_C_message',{value:data.value});
    });

    socket.on('C_to_S_broadcast',function(data){
        socket.broadcast.emit('S_to_C_message',{value:data.value});
    });

    socket.on('disconnect',function(){

    });
});
