const express = require("express");

const router = express.Router();
const { sendReponsetoSQS, receiveResponseFromSQS } = require('../controllers/SQSController.js');

router.post('/send', sendReponsetoSQS);
router.post('/receive', receiveResponseFromSQS);

module.exports = router;