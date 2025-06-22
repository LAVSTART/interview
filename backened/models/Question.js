const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  session: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Session"        // 🔗 Reference to Session model
  },
  question: String,        // 💬 Interview question
  answer: String,          // 🧠 AI or user-provided answer
  note: String,            // 📝 User notes (optional)
  isPinned: {              // 📌 For marking important questions
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true         // 🕒 Automatically adds createdAt & updatedAt
});

module.exports = mongoose.model("Question", questionSchema);
