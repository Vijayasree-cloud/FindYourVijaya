require('dotenv').config({ path: './.env' });
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  console.log("Testing key:", process.env.GROQ_API_KEY);
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say hello in JSON { "message": "hello" }' }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: "json_object" }
    });
    console.log("Success!", chatCompletion.choices[0]?.message?.content);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
main();
