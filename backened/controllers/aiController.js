// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const { questionAnswerPrompt, conceptExplainPrompt } = require('../utils/prompts');
// require('dotenv').config(); // Make sure environment variables are loaded

// // Initialize Gemini with your API key
// const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// /**
//  * @desc    Generate interview questions and answers using Gemini
//  * @route   POST /api/ai/generate-questions
//  * @access  Private
//  */

// const generateInterviewQuestions = async (req, res) => {
//   try {
//     const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

//     if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

//     const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

//     const result = await model.generateContent({
//   contents: [
//     {
//       role: "user",
//       parts: [{ text: prompt }],
//     },
//   ],
// });

//     const response = await result.response;
//     const rawText = await response.text();

//     // Clean the wrapping ```json ... ``` and trim
//     const cleanedText = rawText
//       .replace(/^```json\s*/, '')  // remove starting ```json
//       .replace(/```$/, '')         // remove ending ```
//       .trim();                     // remove extra spaces

//     // Parse JSON content
//     const data = JSON.parse(cleanedText);

//     res.status(200).json(data);

//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to generate questions",
//       error: error.message,
//     });
//   }
// };

// module.exports = { generateInterviewQuestions };
// /**
//  * @desc    Generate explanation for a concept
//  * @route   POST /api/ai/generate-explanation
//  * @access  Private
//  */
// const generateConceptExplanation = async (req, res) => {
//   try {
//     const { concept } = req.body;

//     if (!concept) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const prompt = conceptExplainPrompt(concept);

//     const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

//     const result = await model.generateContent({
//       contents: prompt,
//     });

//     const response = await result.response;
//     const rawText = await response.text();

//     const cleanedText = rawText
//       .replace(/^```json\s*/, '')
//       .replace(/```$/, '')
//       .trim();

//     const data = JSON.parse(cleanedText);

//     res.status(200).json(data);

//   } catch (error) {
//     console.error("❌ Error in generateConceptExplanation:", error.message);
//     res.status(500).json({
//       message: "Failed to generate concept explanation",
//       error: error.message,
//     });
//   }
// };


// module.exports = { generateInterviewQuestions, generateConceptExplanation };

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { questionAnswerPrompt, conceptExplainPrompt } = require('../utils/prompts');
require('dotenv').config();

// Initialize Gemini
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

/**
 * Utility function to safely parse JSON returned by Gemini
 */
function safeParseJson(rawText) {
  const cleanedText = rawText
    .replace(/^```json\s*/i, '') // Remove starting ```json (case insensitive)
    .replace(/```$/, '')         // Remove ending ```
    .trim();

  try {
    return { data: JSON.parse(cleanedText), raw: cleanedText };
  } catch (err) {
    console.error("❌ JSON Parse Error:", err.message);
    return { error: err.message, raw: cleanedText };
  }
}

/**
 * @desc    Generate interview questions using Gemini
 * @route   POST /api/ai/generate-questions
 * @access  Private
 */
const generateInterviewQuestions = async (req, res) => {
  try {
    const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

    if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
    
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const response = await result.response;
    const rawText = await response.text();
    console.log("🧠 Gemini Raw Output (Questions):", rawText);

    const { data, error, raw } = safeParseJson(rawText);

    if (error || !data) {
      return res.status(500).json({
        message: "Gemini returned invalid response.",
        error,
        raw,
      });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error("❌ Error in generateInterviewQuestions:", error.message);
    res.status(500).json({
      message: "Failed to generate interview questions.",
      error: error.message,
    });
  }
};

/**
 * @desc    Generate explanation for a concept using Gemini
 * @route   POST /api/ai/generate-explanation
 * @access  Private
 */
const generateConceptExplanation = async (req, res) => {
  try {
    const { concept } = req.body;

    if (!concept) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = conceptExplainPrompt(concept);

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const response = await result.response;
    const rawText = await response.text();
    console.log("🧠 Gemini Raw Output (Explanation):", rawText);

    const { data, error, raw } = safeParseJson(rawText);

    if (error || !data) {
      return res.status(500).json({
        message: "Gemini returned invalid explanation format.",
        error,
        raw,
      });
    }

    res.status(200).json(data);

  } catch (error) {
    console.error("❌ Error in generateConceptExplanation:", error.message);
    res.status(500).json({
      message: "Failed to generate concept explanation.",
      error: error.message,
    });
  }
};

module.exports = {
  generateInterviewQuestions,
  generateConceptExplanation
};
