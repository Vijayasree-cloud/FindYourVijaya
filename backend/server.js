require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');

const rolesData = require('./data/roles.json');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

// Groq Setup
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy-key" });

// 1) Resume Scan
app.post('/api/resume/upload', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text;
    res.json({ message: "Resume parsed successfully", text: resumeText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to parse resume" });
  }
});

app.post('/api/score', async (req, res) => {
  try {
    const { resumeText, targetRole } = req.body;
    
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "dummy-key") {
       return res.status(400).json({ error: "GROQ_API_KEY is not configured on the server." });
    }

    const prompt = `Analyze this resume text against the target role: ${targetRole}. 
    Provide a JSON response with:
    - score (number out of 100 based on ATS match)
    - missingKeywords (array of strings)
    - matchedSkills (array of strings)
    - feedback (short paragraph)
    - improvements (array of 3-4 specific, actionable suggestions to improve the resume)
    
    Resume Text:
    ${resumeText.substring(0, 3000)}`;
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: "json_object" }
    });
    const text = chatCompletion.choices[0]?.message?.content || "{}";
    
    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
    } catch(e) {
      parsedResult = {
         score: 70,
         missingKeywords: ["Specific Toolings"],
         matchedSkills: ["General tech skills"],
         feedback: "Couldn't parse AI response properly."
      }
    }
    res.json(parsedResult);
  } catch(error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: `Failed to score resume: ${error.message}` });
  }
});

// 2) Career Role Suggestions
app.post('/api/recommend', async (req, res) => {
  const { resumeText } = req.body;
  
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "dummy-key") {
       return res.status(400).json({ error: "GROQ_API_KEY is not configured on the server." });
  }

  if (!resumeText) {
       return res.status(400).json({ error: "Resume text is required for recommendations." });
  }

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
  ${resumeText.substring(0, 3000)}`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: "json_object" }
    });
    const text = chatCompletion.choices[0]?.message?.content || "{}";
    const parsedResult = JSON.parse(text);
    res.json(parsedResult);
  } catch(error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate recommendations from AI." });
  }
});

// 3) Salary Growth Prediction
app.post('/api/simulate-salary', (req, res) => {
  const { roleName } = req.body;
  const role = rolesData.find(r => r.roleName.toLowerCase() === roleName?.toLowerCase()) || rolesData[0];
  
  const y1 = role.avgSalaryYear1;
  const y5 = role.avgSalaryYear5;
  const diff = (y5 - y1) / 4;
  
  const progression = [
    { year: "Year 1", salary: Math.round(y1) },
    { year: "Year 2", salary: Math.round(y1 + diff) },
    { year: "Year 3", salary: Math.round(y1 + diff * 2) },
    { year: "Year 4", salary: Math.round(y1 + diff * 3) },
    { year: "Year 5", salary: Math.round(y5) }
  ];
  
  res.json({ role: role.roleName, progression });
});

// 3) Role Details Generator
app.post('/api/role-details', async (req, res) => {
  const { roleName, resumeText } = req.body;
  
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "dummy-key") {
      return res.status(400).json({ error: "GROQ_API_KEY is not configured on the server." });
  }

  const prompt = `Provide a comprehensive, professional, and detailed description for the career role: "${roleName}".
  ${resumeText ? `Also, analyze this resume text and identify what skills the candidate ALREADY HAS for this specific role, and what critical skills they are MISSING to get this role. Resume Text: """${resumeText}"""` : ''}
  Return pure JSON matching this structure:
  {
    "description": "A detailed 3-4 sentence paragraph describing the role's primary purpose and impact.",
    "responsibilities": ["Responsibility 1", "Responsibility 2", "Responsibility 3"],
    "dayInTheLife": "A short paragraph describing a typical day in this role.",
    "category": "Tech / Data / Cloud / Cyber / etc.",
    "demandScore": Number (0-100),
    "automationRiskScore": Number (0-100),
    "typicalPrivateRoles": [
      { "title": "MNCs & Big Tech - e.g. Software Engineer", "description": "Short description" },
      { "title": "Startups - e.g. Full Stack Developer", "description": "Short description" }
    ],
    "typicalGovtRoles": [
      { "title": "Public Sector (PSUs) - e.g. IT Officer", "description": "Short description" },
      { "title": "Defense & Space - e.g. Scientist B", "description": "Short description" }
    ]${resumeText ? `,
    "roleSpecificSkills": {
      "matchedSkills": ["Skill 1", "Skill 2"],
      "missingSkills": ["Skill 3", "Skill 4"]
    }` : ''}
  }`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: "json_object" }
    });
    const text = chatCompletion.choices[0]?.message?.content || "{}";
    const parsedResult = JSON.parse(text);
    res.json(parsedResult);
  } catch(error) {
    console.error("AI Error:", error);
    // Fallback to generic data if AI fails
    res.json({
      description: "An essential role focused on solving complex problems within its domain.",
      responsibilities: ["Core task execution", "Cross-functional collaboration", "Process improvement"],
      dayInTheLife: "Daily standups, focused deep work sessions, and continuous learning.",
      category: "Professional",
      demandScore: 85,
      automationRiskScore: 40,
      typicalPrivateRoles: [
        { title: "MNCs & Big Tech", description: "Standard private sector engineering roles." },
        { title: "Startups", description: "Fast-paced development roles." }
      ],
      typicalGovtRoles: [
        { title: "Public Sector", description: "Government tech administration." },
        { title: "Defense", description: "Secure communications engineering." }
      ],
      roleSpecificSkills: {
        matchedSkills: [],
        missingSkills: ["Core Technical Competencies"]
      }
    });
  }
});

// 4) Salary Growth Prediction
app.post('/api/roadmap', async (req, res) => {
   const { targetRole } = req.body;
   
   if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "dummy-key") {
       return res.status(400).json({ error: "GROQ_API_KEY is not configured on the server." });
    }

   const prompt = `Create a 6-month learning roadmap for a ${targetRole}. Return pure JSON matching this structure:
   {
      "roadmap": {
         "month1": { "focus": "...", "skillsToLearn": ["..."], "project": "...", "resources": [{"name": "...", "link": "...", "type": "Free"}] },
         "month3": { "focus": "...", "skillsToLearn": ["..."], "project": "...", "resources": [{"name": "...", "link": "...", "type": "Paid"}] },
         "month6": { "focus": "...", "skillsToLearn": ["..."], "project": "...", "resources": [{"name": "...", "link": "...", "type": "Free"}] }
      }
   }
   CRITICAL REQUIREMENT: As an AI, you cannot verify exact course URLs and will hallucinate them. DO NOT try to provide exact paths like coursera.org/learn/specific-course. Instead, you MUST provide real, functional search URLs for major platforms. Example formats you MUST use: 
   - "https://www.youtube.com/results?search_query=[Topic]"
   - "https://www.coursera.org/search?query=[Topic]"
   - "https://www.udemy.com/courses/search/?q=[Topic]"
   The "type" field MUST be exactly "Free" or "Paid".`;
   
   try {
     const chatCompletion = await groq.chat.completions.create({
       messages: [{ role: 'user', content: prompt }],
       model: 'llama-3.3-70b-versatile',
       response_format: { type: "json_object" }
     });
     const text = chatCompletion.choices[0]?.message?.content || "{}";
     res.json(JSON.parse(text));
   } catch(e) {
     res.status(500).json({ error: "Roadmap generation failed" });
   }
});

// 5) Mock Interview Endpoints
app.post('/api/interview/generate', async (req, res) => {
  const { resumeText, targetRole } = req.body;
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "dummy-key") {
      return res.status(400).json({ error: "GROQ_API_KEY is not configured on the server." });
  }

  const prompt = `You are an expert technical recruiter and hiring manager. 
  I am applying for the role of "${targetRole}".
  Here is my resume: """${resumeText}"""
  
  Generate EXACTLY 5 challenging interview questions tailored specifically to my resume. 
  Include a mix of behavioral and technical questions that challenge the claims made in my resume.
  Do not ask generic questions; reference my specific skills, projects, or experiences.
  
  Return pure JSON matching this structure:
  {
    "questions": [
      "Question 1 (Specific to resume claim)",
      "Question 2 (Technical question based on listed skill)",
      "Question 3 (Behavioral)",
      "Question 4",
      "Question 5"
    ]
  }`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: "json_object" }
    });
    const text = chatCompletion.choices[0]?.message?.content || '{"questions": []}';
    res.json(JSON.parse(text));
  } catch(e) {
    console.error("Interview Gen Error:", e);
    res.status(500).json({ error: "Failed to generate interview questions" });
  }
});

app.post('/api/interview/evaluate', async (req, res) => {
  const { question, answer } = req.body;
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "dummy-key") {
      return res.status(400).json({ error: "GROQ_API_KEY is not configured on the server." });
  }

  const prompt = `You are an expert interviewer evaluating a candidate's answer.
  Question asked: "${question}"
  Candidate's answer: "${answer}"
  
  Evaluate the answer objectively. Be constructive but strict.
  Return pure JSON matching this structure:
  {
    "score": Number (0 to 10),
    "feedback": "A concise 2-3 sentence paragraph explaining what was good and what was missing.",
    "idealAnswerConcepts": ["Concept 1 they should have mentioned", "Concept 2"]
  }`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: "json_object" }
    });
    const text = chatCompletion.choices[0]?.message?.content || "{}";
    res.json(JSON.parse(text));
  } catch(e) {
    console.error("Interview Eval Error:", e);
    res.status(500).json({ error: "Failed to evaluate answer" });
  }
});

const fs = require('fs');
const path = require('path');

// 6) AI Job Opportunity Generator
app.post('/api/opportunities', async (req, res) => {
  const { roles } = req.body;
  
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "dummy-key") {
      return res.status(400).json({ error: "GROQ_API_KEY is not configured on the server." });
  }

  const prompt = `Based on these recommended career roles for the candidate: ${roles.join(', ')}
  Generate exactly 5 highly realistic, specific job opportunities they could apply for right now.
  Return pure JSON matching this structure:
  {
    "opportunities": [
      {
        "id": "String (unique random id)",
        "role": "String (e.g. Senior Machine Learning Engineer)",
        "companyName": "String (realistic company name, e.g. TechFlow AI)",
        "location": "String (e.g. Remote, or New York, NY)",
        "type": "String (Full-time or Contract)",
        "salaryRange": "String (e.g. $130k - $160k)",
        "matchPercentage": Number (0-100),
        "requiredSkills": ["Skill 1", "Skill 2", "Skill 3"],
        "description": "A short 2-sentence description of what this job entails.",
        "applyLink": "String (e.g. https://www.linkedin.com/jobs/search?keywords=Data+Scientist)"
      }
    ]
  }`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.1-8b-instant',
      response_format: { type: "json_object" }
    });
    const text = chatCompletion.choices[0]?.message?.content || "{}";
    const parsedResult = JSON.parse(text);
    res.json(parsedResult.opportunities || []);
  } catch(error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "Failed to generate job opportunities." });
  }
});

const nodemailer = require('nodemailer');

// 9) Upcoming Jobs Notification
app.post('/api/subscribe', async (req, res) => {
  const { email, role, location } = req.body;
  
  try {
    let transporter;
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true", 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Create a test ethereal account for development
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, 
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: '"Vijayam Career Alerts" <alerts@vijayam.ai>',
      to: email,
      subject: `Job Alert Subscription Confirmed: ${role}`,
      text: `Hello!\n\nYou have successfully subscribed to job alerts for the role of ${role} in ${location}.\nWe will notify you when new opportunities match your profile.\n\nBest regards,\nVijayam Team`,
      html: `<b>Hello!</b><br/><br/>You have successfully subscribed to job alerts for the role of <b>${role}</b> in <b>${location}</b>.<br/>We will notify you when new opportunities match your profile.<br/><br/>Best regards,<br/>Vijayam Team`
    });

    console.log("Message sent: %s", info.messageId);
    let previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Preview URL: %s", previewUrl);
    }
    
    res.json({ 
      status: "success", 
      message: "Job alert sent successfully! Check your email inbox.",
      previewUrl: previewUrl || undefined
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ status: "error", error: "Failed to send email notification" });
  }
});

// Helpful endpoint for Roles
app.get('/api/roles', (req, res) => {
  res.json(rolesData);
});

// Import and register new DB routes (removed for Supabase migration)
// Backend now acts solely as an AI gateway proxy

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (Supabase Backend Mode)`);
});
