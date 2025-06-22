// Prompt generator for interview Q&A
function questionAnswerPrompt(role, experience, topics, number) {
  return `You are an AI interview assistant.
Generate ${number} interview questions and answers in JSON format using the following structure:

[
  {
    "question": "string",
    "answer": "string"
  }
]

The questions should be tailored for a ${role} with ${experience} experience.
Focus on the following topics: ${topics.join(', ')}.

Answers should be concise but informative.`;
}

// Prompt generator for concept explanation (Markdown format)
function conceptExplainPrompt(concept) {
  return [
    {
      role: "user",
      parts: [
        {
          text: `You are a helpful technical interview assistant.

Explain the concept: **"${concept}"**

Return the explanation in **Markdown format** using:
- Headings
- Bullet points
- **Bold**, _italics_, and \`inline code\`
- Code examples wrapped in \`\`\`js blocks

Avoid wrapping the response in \`\`\`json or any enclosing block — just return clean Markdown.`,
        },
      ],
    },
  ];
}

module.exports = {
  questionAnswerPrompt,
  conceptExplainPrompt,
};
