
const asyncHandler = require("../middleware/async");
const {receiveResponseFromSQS, sendReponsetoSQS, deleteMessageFromSQS } = require('../utils/utils');
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

exports.receiveResponseAndDeleteFromSQS = asyncHandler(async (req, res, next) => {
    try {
        const response = await receiveResponseFromSQS();
        let messageList = [];
        if(response.body.Messages !== undefined && response.body.Messages.length > 0) {
            console.log(`Found ${response.body.Messages.length} messages`);
            var messages = response.body.Messages;

            messages.forEach(async element => {
                // console.log(element);
                messageList.push(element.Body);

                await deleteMessageFromSQS(element.ReceiptHandle);
            });
        } else {
            console.log(`Found 0 messages`);
            return res.status(204);
        }

        return res.status(200).json({'message' : messageList});
    } catch(err) {
        return next(
            new ErrorResponse(`Receive Message failed with error ${err}`, 500)
        );
    }
});