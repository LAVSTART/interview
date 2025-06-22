const express = require('express');
const {
  togglePinQuestion,
  updateQuestionNote,
  addQuestionsToSession,
} = require('../controllers/questionController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// ✅ Add questions to a session
router.post('/add', protect, addQuestionsToSession);

// ✅ Toggle pin/unpin a question
router.post('/:id/pin', protect, togglePinQuestion);

// ✅ Update a note on a specific question
router.post('/:id/note', protect, updateQuestionNote);

module.exports = router;
