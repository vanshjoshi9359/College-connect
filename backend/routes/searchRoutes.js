const express = require('express');
const router = express.Router();
const { searchContent, getTopComments, getSearchSuggestions } = require('../controllers/searchController');
const { optionalAuth } = require('../middleware/optionalAuth');

// Search routes
router.get('/', searchContent);
router.get('/suggestions', getSearchSuggestions);
router.get('/top-comments/:topicId', optionalAuth, getTopComments);

module.exports = router;
