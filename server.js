// Write a message to the console.
const express = require("express");
const dotenv = require('dotenv');
const colors = require('colors');

const port = 3000;

// Load env vars
console.log(process.env.NODE_ENV);

if(process.env.NODE_ENV === 'development') {
	dotenv.config({path : './config/config.env'});
} else {
	dotenv.config({path : './config/config-prod.env'});
}

// Routes
const routes = require('./routes/router');
const errorHandler = require('./middleware/errorResponse');

const app = express();
app.use(express.static('public'));

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/v1/', routes);

// Error
app.use(errorHandler);

const hostname = '0.0.0.0';
const server = app.listen(port, hostname, () => {
	console.log(`Server running in ${process.env.NODE_ENV} at http://${hostname}:${port}/`.blue.bold);
});

server.on('connection', function(socket) {
	console.log("A new connection was made by a client.".blue);
	socket.setTimeout(500 * 1000); 
	socket.setKeepAlive = true;
	server.keepAliveTimeout = app.request.keepAliveTimeout =  500 * 1000;
	server.headersTimeout = app.request.headersTimeout = 500 * 1000;
});
