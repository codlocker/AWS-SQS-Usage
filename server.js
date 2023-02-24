// Write a message to the console.
const express = require("express");
const dotenv = require('dotenv');
const morgan = require('morgan');
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

// Mount logger
app.use(morgan('combined'));

// Mount routers
app.use('/api/v1/', routes);

// Error
app.use(errorHandler);

const hostname = '0.0.0.0';
const server = app.listen(port, hostname, () => {
	console.log(`Server running in ${process.env.NODE_ENV} at http://${hostname}:${port}/`.yellow.bold);
});

server.setTimeout(600000);
server.timeout = 600000;
server.requestTimeout = 600000;