var http = require('http');

var server = http.createServer(require('./app'));

var port = process.env.PORT || 3000;

var db = require('./db');

// if (process.env.SYNC){
// 	db.sync()
// 	.then(function(){
// 		console.log('tables created');
// 	});
// }

db.seed()
.then(function(){
	console.log('seeded');
	server.listen(port,function(){
		console.log('server listening to port '+port);
	});
});


