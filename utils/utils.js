const fs = require("fs");
const AWS = require("aws-sdk");
const path = require("path")

AWS.config.update({ region: 'us-east-1'});
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

let base64_encode = (file) => {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
};

exports.sendReponsetoSQS = async (filePath) => {
    var data_base_64_encoded = base64_encode(filePath);

    let params = {
        DelaySeconds: 30,
        MessageAttributes: {
            "FileName": {
               DataType: "String",
               StringValue: path.basename(filePath)
            },
        },
        MessageBody: data_base_64_encoded,
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/214776426364/sqs1"
    }

    let queueRes = await sqs.sendMessage(params).promise();
    const response = {
        statusCode: 200,
        body: queueRes,
    };
    
    // console.log(response);
    
    return response;
}

exports.receiveResponseFromSQS = async () => {
    var params = {
        QueueUrl: "https://sqs.us-east-1.amazonaws.com/214776426364/SQS2",
        AttributeNames: [
            "All"
        ],
        MaxNumberOfMessages: 10
    };

    let queueRes = await sqs.receiveMessage(params).promise();

    const response = {
        statusCode: 200,
        body: queueRes,
    };

    return response;
};