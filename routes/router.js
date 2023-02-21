const express = require("express");

const router = express.Router();
const { getFiles, uploadFileHandler: uploadFile, upload } = require('../controllers/FilesController.js');

const { sendReponsetoSQS, receiveResponseAndDeleteFromSQS } = require('../controllers/SQSController.js');


router.get('/', getFiles);
router.post('/', upload.single('myfile'), uploadFile);

router.post('/send', sendReponsetoSQS);
router.post('/receive', receiveResponseAndDeleteFromSQS);

module.exports = router;