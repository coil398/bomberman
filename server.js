var express = require('express'),
    path = require('path'),
    http = require('http'),
    Recent_api = require('./routes/recent');
    User_api = require('./routes/token'),
    Room_api = require('./routes/room');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

// APIs for /recent
app.post('/recent/create',Recent_api.create);
app.delete('/recent/delete/all',Recent_api.deletetable);
app.delete('/recent/delete/:id',Recent_api.delete);
app.get('/recent',Recent_api.getAll);
app.get('/recent/:id',Recent_api.get);

// An API for /token
app.post('/token/create',User_api.create_token);
app.get('/token/index',User_api.get_list);
app.delete('/token/delete/all',User_api.deletetable);

// APIs for /room
app.post('/room/index',Room_api.get_list);
app.post('/room/create',Room_api.create_room);
app.post('/room/detail',Room_api.get_detail);

/*
app.get('/recent',Recent_api.hage);
app.post('/recent/create',Recent_api.create);
app.get('/recent/display',Recent_api.get);
app.post('/token/create',User_api.create_token);
app.post('/room/index',Room_api.get_list);
app.post('/room/create',Room_api.create_room);
app.post('/room/detail',Room_api.get_detail);
*/
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
