
const asyncHandler = require("../middleware/async");
const {receiveResponseFromSQS, sendReponsetoSQS } = require('../utils/utils');
const ErrorResponse = require("../middleware/errorResponse");
const path = require("path");


exports.sendReponsetoSQS = asyncHandler(async (req, res, next) => {

    try {
        const path_update = path.resolve(req.body.filePath);
        const response = await sendReponsetoSQS(path_update);
        return res.status(200).json({'message' : response});
    } catch(err) {
        return next(
            new ErrorResponse(`Send Message failed with error ${err}`, 500)
        );
    }
});

exports.receiveResponseFromSQS = asyncHandler(async (req, res, next) => {
    try {
        const response = await receiveResponseFromSQS();
        return res.status(200).json({'message' : response});
    } catch(err) {
        return next(
            new ErrorResponse(`Receive Message failed with error ${err}`, 500)
        );
    }
});