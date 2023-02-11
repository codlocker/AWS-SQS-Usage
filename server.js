// Write a message to the console.
const express = require("express");
const AWS = require("aws-sdk");
const fs = require("fs");
const { SQSClient, AddPermissionCommand } = require("@aws-sdk/client-sqs");

const port = 3000;

// Routes
const files = require('./routes/files');

const app = express();
app.use(express.static('public'));

// Mount routers
app.use('/api/v1/files', files);


const hostname = '0.0.0.0';
const server = app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});