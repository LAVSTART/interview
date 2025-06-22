const Question = require('../models/Question');
const Session = require('../models/Session');

// @desc    Add additional questions to an existing session
// @route   POST /api/questions/add
// @access  Private
exports.addQuestionsToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: sessionId,
          question: q.question,
          answer: q.answer,
          note: q.note || '',
        });
        return question._id;
      })
    );

    // Add new question IDs to the session
    session.questions.push(...questionDocs);
    await session.save();

    res.status(200).json({
      success: true,
      message: 'Questions added successfully',
      questionIds: questionDocs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Pin or unpin a question
// @route   POST /api/questions/:id/pin
// @access  Private
exports.togglePinQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({
      success: true,
      message: `Question ${question.isPinned ? 'pinned' : 'unpinned'}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a note for a question
// @route   POST /api/questions/:id/note
// @access  Private
exports.updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.note = note || '';
    await question.save();

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
