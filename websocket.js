var ws = require('ws').Server;

var server = new ws({port:3000});
server.on('connection',function(ws){
    console.log('connected!');
    ws.on('message',function(message){
        console.log(message.toString());
    });
    ws.on('close',function(){
        console.log('disconnected...');
    });
    setInterval(function(){
        ws.send('Hi!');
    },1000);
});
