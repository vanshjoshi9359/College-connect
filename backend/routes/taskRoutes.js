const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  createTask,
  getGroupTasks,
  completeTask,
  uncompleteTask,
  deleteTask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

router.post(
  '/',
  protect,
  [
    body('groupId').notEmpty().withMessage('Group ID is required'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('dueDate').notEmpty().withMessage('Due date is required')
  ],
  createTask
);

router.get('/group/:groupId', getGroupTasks);
router.post('/:id/complete', protect, completeTask);
router.post('/:id/uncomplete', protect, uncompleteTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
