// TCP Echo サーバ MMOG風

var sys = require('util');
var net = require('net');
var DB = require('./accessToDB');


var sockets = new Array();

var server = net.createServer(function (socket) {
    console.log("A Server is active");
    socket.setEncoding("utf8");

    // 新しい接続を受けいれたとき
    socket.addListener("connect", function () {
        socket.addrString = socket.remoteAddress + ":" + socket.remotePort;
        sockets[socket.addrString] = socket;
        socket.counter = 0;       // 接続ごとに、状態を持つ
        socket.write("hello: " + socket.addrString + "\r\n");
    });

    // データが来たとき
    socket.addListener("data", function (data) {
        socket.counter ++;

        if( data.match( /^&lt;policy-file-request/ ) ){
            sys.puts( "policy file requested\n");
            socket.write( "\n" );
        } else {
            socket.write( "message from " + socket.addrString + ":" + socket.counter + " : " + data);
        }

        console.log( "data:" + data + "\n" );
    });

    // 切れたとき
    socket.addListener("end", function () {
        delete sockets[ socket.addrString ];

        console.log( "end. socknum:" + sockets.length);
    });
});
server.listen(7000, "localhost"); // サーバー待ち受け開始
