const asyncHandler =  require('../middleware/async');
const multer = require("multer");
const fs = require("fs");
const fileUploadPath = __dirname + process.env.IMAGE_UPLOAD_PATH;
const ErrorResponse = require("../middleware/errorResponse");
const {sendReponsetoSQS, receiveAndDeleteFromSQS } = require('../utils/utils');
const { basename } = require('path');

exports.upload = multer({ dest: fileUploadPath });

exports.getFiles = asyncHandler(async (req, res, next) => {
    var filesList = [];
	console.log(fileUploadPath);
	
	var files = await fs.promises.readdir(fileUploadPath);
	console.log(files);

	files.forEach(e => filesList.push(`${fileUploadPath}\\${e}`));

	res.status(200).json(
		{ "data" : filesList });
});


exports.uploadFileHandler = asyncHandler(async (req, res, next) => {
	try {
		// if (req.file) console.log(req.file);
		var givenFileName = fileUploadPath + req.file.filename;
		var actualFileName = fileUploadPath + req.file.originalname;
		
		await fs.promises.rename(givenFileName, actualFileName);

		let response = await sendReponsetoSQS(actualFileName);

		let receive_response = await receiveAndDeleteFromSQS();
		
		const messageFileUpload = `File ${basename(actualFileName)} uploaded successfully!!\n`

		// process messages
		var message = "";
		if(receive_response.statusCode == 200) {
			receive_response.message.forEach(async element => {
				message += element;
			});
		}

		res.status(200).send(messageFileUpload + message);

	} catch(err) {
		return next(
            new ErrorResponse(`Something failed with error ${err}`, 500)
        );
	}
});
