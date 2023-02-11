const asyncHandler =  require('../middleware/async');
const multer = require("multer");
const fs = require("fs");
const fileUploadPath = __dirname + '/../upload_images/';

exports.upload = multer({ dest: fileUploadPath });

exports.getFiles = asyncHandler(async (req, res, next) => {
    var filesList = [];
	console.log(fileUploadPath);
	
	var files = fs.readdirSync(fileUploadPath);
	console.log(files);

	files.forEach(e => filesList.push(`${fileUploadPath}\\${e}`));

	res.status(200).json(
		{ "data" : filesList });
});


exports.uploadFile = asyncHandler(async (req, res, next) => {
	if (req.file) console.log(req.file);
	var fs = require('fs');
	console.log(fileUploadPath + req.file.filename);
	fs.rename(fileUploadPath + req.file.filename, fileUploadPath + req.file.originalname, function (err) {
		if (err) console.log('ERROR: ' + err);
	});
	res.end(req.file.originalname + ' uploaded!');
});
