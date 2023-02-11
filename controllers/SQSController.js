const AWS = require("aws-sdk");
const { SQSClient, AddPermissionCommand } = require("@aws-sdk/client-sqs");
const asyncHandler = require("../middleware/async");
const { base64_encode } = require('../utils/utils');

AWS.config.update({ region: 'us-east-1'});
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });


exports.sendImage = asyncHandler(async (req, res, next) => {

    var data_base_64_encoded = base64_encode(req.body.filePath);

    let params = {
        DelaySeconds: 30,
        MessageAttributes: {
            "FileName": {
               DataType: "String",
               StringValue: req.body.filePath
            },
        },
        MessageBody: data_base_64_encoded,
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/214776426364/sqs1"
    }

    sqs.sendMessage(params, function(err, data) {
        if(err) {
            console.log("Error ", err);
            return res.status(500);
        } else {
            console.log('Success', data);
            return res.status(200).json({ 'data' : data.MessageId});
        }
    });

});