const Session = require('../models/Session');
const Question = require('../models/Question'); // If sessions have related questions

// @desc    Create a new session
// @route   POST /api/sessions/create
// @access  Private
exports.createSession = async (req, res) => {
      console.log("🟡 createSession controller hit"); 
  try {
    console.log("🟢 Received body:", req.body); // log incoming data

    const { role, experience, topicsToFocus, description, questions } = req.body;
    const userId = req.user._id;

    const session = await Session.create({
      user: userId,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await Promise.all(
      questions.map(async (q) => {
        const question = await Question.create({
          session: session._id,
          question: q.question,
          answer: q.answer,
        });
        return question._id;
      })
    );

    session.questions = questionDocs;
    await session.save();

    res.status(201).json({
      success: true,
      message: "Session created with questions",
      session,
    });
  } catch (error) {
    console.error("❌ Create session error:", error); // ADD THIS LINE
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// @desc    Get all sessions for the logged-in user
// @route   GET /api/sessions/my-sessions
// @access  Private
exports.getMySessions = async (req, res) => {
  try {
const sessions = await Session.find({ user: req.user._id })
     .sort({ createdAt: -1 })
      .populate("questions"); // 

    res.status(200).json({ success: true, sessions });
  } catch (error) {
    console.error("Get my sessions error:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get a session by ID with populated questions (if needed)
// @route   GET /api/sessions/:id
// @access  Private
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("questions");

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Check ownership
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    console.error("Get session by ID error:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete a session and optionally its questions
// @route   DELETE /api/sessions/:id
// @access  Private
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Check ownership
    if (session.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Optionally delete related questions
    await Question.deleteMany({ session: session._id });

    await session.remove();

    res.status(200).json({ success: true, message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
