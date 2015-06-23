
DrawApp = {};

DrawApp.socketDraw = function () {
	//socket fields
	var hostURL = "https://canvas-js-app.herokuapp.com/",
		socket = io.connect(hostURL),
		canvas = document.querySelector('#drawingCanvas'),
		ctx = canvas.getContext('2d'),
		getColor = getRandomColor(),
		clientsColor,
		container = document.querySelector('#container'),
		containerStyle = getComputedStyle(container),
		id = Math.round($.now()*Math.random()),
		drawing = false,
		clients = {},
		mouse = {x: 0,
				 y: 0},
		prevEmit = $.now();

	//set the parameter of the canvas to the contianer
	canvas.width = parseInt(containerStyle.getPropertyValue('width'));
	canvas.height = parseInt(containerStyle.getPropertyValue('height'));

	ctx.lineWidth = 1;
	ctx.lineJoin = 'round';
	ctx.lineCap = 'round';
	ctx.strokeStyle = getColor;

	socket.on('moving', function (data){
		if(data.drawing && clients[data.id]){
			clients.x = clients[data.id].x;
			clients.y = clients[data.id].y;
			clientsColor = clients[data.id].clientsColor;
			ctx.strokeStyle = clientsColor;
			clientDraw();
		}
		clients[data.id] = data;
		clients[data.id].updated = $.now();
	});

	canvas.addEventListener('mousemove', function (e){
		clientsColor = getColor;

		mouse.x = e.pageX - this.offsetLeft;
		mouse.y = e.pageY - this.offsetTop;
		
		if($.now() - prevEmit > 30){
			socket.emit('mousemove', {
				'x': e.pageX - this.offsetLeft,
				'y': e.pageY - this.offsetTop,
				'drawing': drawing,
				'id': id,
				'clientsColor': clientsColor
			});
			prevEmit = $.now();
		}

	}, false);

	canvas.addEventListener('mousedown', function (e){
		e.preventDefault();
		drawing = true;
		ctx.beginPath();
		ctx.moveTo(mouse.x, mouse.y);

		canvas.addEventListener('mousemove', drawLine, false);
	}, false);

	canvas.addEventListener('mouseup', function (){
		canvas.removeEventListener('mousemove', drawLine, false);
		drawing = false;
	}, false);

	function drawLine () {
		ctx.lineTo(mouse.x, mouse.y);			
		ctx.stroke();
	}

	function clientDraw () {
		ctx.lineTo(clients.x, clients.y);			
		ctx.stroke();
	}

	//determine a random color
	function getRandomColor() {
		var colorChoices = '0123456789ABCDEF'.split('');
		var randomColor = '#';
		for (var i = 0; i < 6; i++){
			randomColor += colorChoices[Math.floor(Math.random() * 16)];
		}
		return randomColor;
	}
}();



// DrawApp = {};

// DrawApp.socketDraw = function () {
// 	//socket fields hostURL = "https://canvas-js-app.herokuapp.com/",
// 	var hostURL = "http://localhost:3000",
// 		socket = io.connect(hostURL),
// 		canvas = $('#drawingCanvas'),
// 		ctx = canvas[0].getContext('2d'),
// 		userColor = getRandomColor();
// 		container = document.querySelector('#container'),
// 		containerStyle = getComputedStyle(container),
// 		id = Math.round($.now()*Math.random()),
// 		drawing = false,
// 		clients = {},
// 		mouse = {x: 0,
// 				 y: 0},
// 		prevEmit = $.now();

// 	//set the parameter of the canvas to the contianer
// 	canvas[0].width = parseInt(containerStyle.getPropertyValue('width'));
// 	canvas[0].height = parseInt(containerStyle.getPropertyValue('height'));

// 	ctx.lineWidth = 1;
// 	ctx.lineJoin = 'round';
// 	ctx.lineCap = 'round';
// 	ctx.strokeStyle = userColor;

// 	socket.on('moving', function (data){
// 		if(data.drawing && clients[data.id]){
// 			mouse.x = clients[data.id].x;
// 			mouse.y = clients[data.id].y
// 			drawLine();
// 		}
// 		clients[data.id] = data;
// 		clients[data.id].updated = $.now();
// 	});

// 	canvas.on('mousedown', function (e){
// 		// e.preventDefault();
// 		drawing = true;
// 		ctx.beginPath();
// 		ctx.moveTo(mouse.x, mouse.y);
// 	});

// 	$(document).bind('mouseup mouseleave', function (){
// 		drawing = false;
// 	});

// 	$(document).on('mousemove', function (e){
// 		// mouse.x = e.pageX - this.offsetLeft;
// 		// mouse.y = e.pageY - this.offsetTop;

// 		if($.now() - prevEmit > 30){
// 			socket.emit('mousemove', {
// 				'x': e.pageX - container.offsetLeft,
// 				'y': e.pageY - container.offsetTop,
// 				'drawing': drawing,
// 				'id': id,
// 				'userColor' : userColor
// 			});
// 			prevEmit = $.now();
// 		}
// 		if(drawing){
// 			drawLine();
// 		}
// 	});

// 	function drawLine () {
// 		ctx.lineTo(mouse.x, mouse.y);			
// 		ctx.stroke();
// 	}

// 	//determine a random color
// 	function getRandomColor() {
// 		var colorChoices = '0123456789ABCDEF'.split('');
// 		var randomColor = '#';
// 		for (var i = 0; i < 6; i++){
// 			randomColor += colorChoices[Math.floor(Math.random() * 16)];
// 		}
// 		return randomColor;
// 	}
// }();
