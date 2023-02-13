const asyncHandler =  require('../middleware/async');
const multer = require("multer");
const fs = require("fs");
const fileUploadPath = __dirname + '/../upload_images/';
const ErrorResponse = require("../middleware/errorResponse");
const {sendReponsetoSQS } = require('../utils/utils');

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
		if (req.file) console.log(req.file);
		var givenFileName = fileUploadPath + req.file.filename;
		var actualFileName = fileUploadPath + req.file.originalname;
		
		await fs.promises.rename(givenFileName, actualFileName);

		const response = await sendReponsetoSQS(actualFileName);

		res.status(200).json(
			{
				"uploadFilePath" : actualFileName,
				"uploadStatus": true,
				"sqsResponse" : response
			});
	} catch(err) {
		return next(
            new ErrorResponse(`Something failed with error ${err}`, 500)
        );
	}
});
