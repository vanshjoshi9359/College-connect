const express = require('express');
const router = express.Router();
const { vote } = require('../controllers/voteController');
const { protect } = require('../middleware/auth');

router.post('/', protect, vote);

module.exports = router;
