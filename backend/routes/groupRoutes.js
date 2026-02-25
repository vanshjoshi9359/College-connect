const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createGroup,
  getGroups,
  getUserGroups,
  getGroup,
  joinGroup,
  leaveGroup,
  getLeaderboard
} = require('../controllers/groupController');
const { protect } = require('../middleware/auth');

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Group name is required'),
    body('description').trim().notEmpty().withMessage('Description is required')
  ],
  createGroup
);

router.get('/', getGroups);
router.get('/my-groups', protect, getUserGroups);
router.get('/:id', getGroup);
router.post('/:id/join', protect, joinGroup);
router.post('/:id/leave', protect, leaveGroup);
router.get('/:id/leaderboard', getLeaderboard);

module.exports = router;
