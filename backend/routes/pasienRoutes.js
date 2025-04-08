const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasienController');
const { verifyToken } = require('../middleware/verifyToken');

router.get('/filter', verifyToken, pasienController.getPasienAdvanced);

module.exports = router;