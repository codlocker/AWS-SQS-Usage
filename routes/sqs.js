const express = require("express");

const router = express.Router();
const { sendImage } = require('../controllers/SQSController.js');

router.post('/', sendImage);

module.exports = router;