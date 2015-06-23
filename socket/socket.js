module.exports = function (io){
	io.on('connection', function (socket){
		console.log('connected to server');
		socket.on('mousemove', function (data) {
    		socket.broadcast.emit('moving', data);
    		console.log(data);
 		});
	});
}

