// Write a message to the console.
const express = require("express");

const port = 3000;

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
	console.log(`Server running at http://${hostname}:${port}/`);
});