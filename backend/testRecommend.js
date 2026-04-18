require('dotenv').config({ path: './.env' });
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function testRecommend() {
  const prompt = `Based on the following resume, recommend exactly 5 distinct career roles that are highly suitable for this candidate. 
  Return pure JSON matching this structure:
  {
    "recommendations": [
      {
        "roleName": "String (e.g. Data Scientist)",
        "category": "String (e.g. Data & Analytics)",
        "matchPercentage": Number (0-100),
        "requiredSkills": ["Skill 1", "Skill 2"],
        "whyRecommended": "A short sentence explaining why this role is a good fit based on their resume."
      }
    ]
  }
  
  Resume Text:
  Software Engineer with 5 years experience in Python and React.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'mixtral-8x7b-32768',
      response_format: { type: "json_object" }
    });
    console.log("Success!");
    console.log(chatCompletion.choices[0]?.message?.content);
  } catch(error) {
    console.error("Groq Error:", error);
  }
}

testRecommend();
