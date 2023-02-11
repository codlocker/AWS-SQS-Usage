const express = require("express");

const router = express.Router();
const { getFiles, uploadFile, upload } = require('../controllers/FilesController.js');

router.get('/', getFiles);
router.post('/', upload.single('myfile'), uploadFile);

module.exports = router;