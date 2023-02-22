const fs = require("fs");
const AWS = require("aws-sdk");
const path = require("path");
const polly = require("polly-js");
const { basename } = require('path');

AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
var sqs = new AWS.SQS({ apiVersion: process.env.SQS_API_VERSION });
let set_of_images_uploaded = new Set();

let base64_encode = (file) => {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
};

exports.sendReponsetoSQS = async (filePath) => {

    var data_base_64_encoded = base64_encode(filePath);
    let baseFileName = path.basename(filePath);

    let params = {
        MessageAttributes: {
            "FileName": {
               DataType: "String",
               StringValue: baseFileName
            },
        },
        MessageBody: data_base_64_encoded,
        QueueUrl: process.env.PUSH_SQS_URI,
        MessageDeduplicationId: baseFileName,
        MessageGroupId: 'ClassifyImages'

    }

    let queueRes = await sqs.sendMessage(params).promise();
    const response = {
        statusCode: 200,
        body: queueRes,
    };
    
    set_of_images_uploaded.add(baseFileName);
    // console.log(response);
    
    return response;
}

let receiveResponseFromSQS = async () => {
    // console.log(process.env.AWS_DEFAULT_REGION);

    var params = {
        QueueUrl: process.env.PULL_SQS_URI,
        AttributeNames: [
            "All"
        ],
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 15,
        WaitTimeSeconds: 10,
    };

    let queueRes = await sqs.receiveMessage(params).promise();

    const response = {
        statusCode: 200,
        body: queueRes,
    };

    return response;
};

let deleteMessageFromSQS = async(messageHandle) => {
    let params = {
        QueueUrl: process.env.PULL_SQS_URI,
        ReceiptHandle: messageHandle
    };

    await sqs.deleteMessage(params).promise();
}

let receiveAndDeleteFromSQS = async(fileName) => {
    console.log(fileName);
    let response = await receiveResponseFromSQS();
    let message = null;
    if(response.body.Messages !== undefined && response.body.Messages.length > 0) {
        console.log(`Found ${response.body.Messages.length} messages`);
        var messages = response.body.Messages;

        messages.forEach(async element => {
            // console.log(element);
            let processed_fileName = element.Body.split(",")[0];
            if(set_of_images_uploaded.has(processed_fileName)) {
                message = element;
                message["processed_fileName"] = processed_fileName;
                await deleteMessageFromSQS(element.ReceiptHandle);
                set_of_images_uploaded.delete(processed_fileName);
                return;
            }
        });
    } else {
        console.log(`Found 0 messages`);
        response = {
            statusCode: 204,
        };
    
        return response;
    }

    if(message === null) {
        response = {
            statusCode: 204,
        };
    } else {
        response = {
            statusCode: 200,
            message: message
        };
    }

    return response;
}

exports.retryResponseSQS = async(fileName) => {
    try {
        const loadResponseFromSQS = () => { return polly()
            .waitAndRetry([100, 200, 400, 800, 1600])
            .executeForPromise(async() => {
                let receive_response = await receiveAndDeleteFromSQS(
                    basename(fileName));
                        // process messages
                // console.log(receive_response);
                if(receive_response.statusCode == 200) {
                    return receive_response;
                }
                console.log("Retrying... Could not fetch data")
                return Promise.reject(receive_response);
            })
        };

        return await loadResponseFromSQS();
    }
    catch(err) {
        return {
            statusCode: 204,
            message: err
        };
    }
}