const express = require("express");

const router = express.Router();
const { getFiles, uploadFileHandler: uploadFile, upload } = require('../controllers/FilesController.js');

const { sendReponsetoSQS, receiveResponseAndDeleteFromSQS } = require('../controllers/SQSController.js');


router.get('/files', getFiles);
router.post('/files', upload.single('myfile'), uploadFile);

router.post('/sqs/send', sendReponsetoSQS);
router.get('/sqs/receiveAndDelete', receiveResponseAndDeleteFromSQS);

module.exports = router;