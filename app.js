var express = require('express'),
    app = express(),
    path = require('path'),
    config = require('./config/config.js');

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/routes.js')(express, app, config);

app.set('port', process.env.PORT || 3000);
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

require('./socket/socket.js')(io);

server.listen(app.get('port'), function (){
	console.log("CanvasDrawApp on Port: " + app.get('port'));
})



