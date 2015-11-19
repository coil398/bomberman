var express = require('express'),
    path = require('path'),
    http = require('http'),
    Room_api = require('./routes/room');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

// APIs for /room
app.get('/room/index',Room_api.get_list);
app.post('/room/create',Room_api.create);
app.post('/room/debug',Room_api.debug);
//app.post('/room/out',Room_api.out);
app.delete('/room/deletetable',Room_api.deletetable);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
