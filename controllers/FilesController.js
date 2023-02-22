const asyncHandler =  require('../middleware/async');
const multer = require("multer");
const fs = require("fs");
const fileUploadPath = __dirname + process.env.IMAGE_UPLOAD_PATH;
const ErrorResponse = require("../middleware/errorResponse");
const {sendReponsetoSQS, retryResponseSQS } = require('../utils/utils');
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
		
		// 1. Upload and rename file
		await fs.promises.rename(givenFileName, actualFileName);


		// 2. Send file data to SQS
		let response = await sendReponsetoSQS(actualFileName);
		let message = "";
		
		// 3. Retry and get response from SQS.
		const sqsResponse = await retryResponseSQS(basename(actualFileName));

		if(sqsResponse.statusCode === 204) {
			message = `Classfication result ${basename(actualFileName)}: not found`
		} else {
			message = `Classfication result ${basename(actualFileName)}: ${sqsResponse.message.Body}`
		}


		const messageFileUpload = `File ${basename(actualFileName)} uploaded successfully!!\n`

		res.status(200).send(messageFileUpload + message);

	} catch(err) {
		return next(
            new ErrorResponse(`Something failed with error ${err}`, 500)
        );
	}
});
