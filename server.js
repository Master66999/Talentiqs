import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mongoose from 'mongoose';
import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';
import OpenAI from 'openai';
import fs from 'fs';
import { readFile } from 'fs/promises';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');

dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/talentIQS';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ─── OTP Store & Mailer Configuration ─────────────────────────────────────────
const otpStore = new Map(); // In-memory storage: email -> { otp, expiry }

// NOTE: For production, use real credentials in .env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'talentiqs.verify@gmail.com',
    pass: process.env.EMAIL_PASS || 'mock-password'
  }
});

// ─── Automation Schema & Worker ───────────────────────────────────────────────
const automationSchema = new mongoose.Schema({
  hrEmail: { type: String, required: true },
  companyName: { type: String, required: true },
  resumePath: { type: String, required: true },
  emailContent: { type: String, required: true },
  frequencyType: { type: String, enum: ['daily', 'interval'], required: true },
  frequencyValue: { type: Number, required: true }, // Times per day OR Interval in minutes
  lastSentAt: { type: Date, default: null },
  totalSent: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const AutomationTask = mongoose.model('AutomationTask', automationSchema);

// ─── Goal & Profile Schemas ───────────────────────────────────────────────────
const goalSchema = new mongoose.Schema({
  email: { type: String, required: true },
  today: { type: String, default: "" },
  weekly: { type: String, default: "" },
  monthly: { type: String, default: "" },
  monthYear: { type: String, required: true }, // e.g. "05-2026"
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const Goal = mongoose.model('Goal', goalSchema);

const userProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: { type: String, default: "" },
  personal: { type: Object, default: {} },
  education: { type: Array, default: [] },
  experience: { type: Array, default: [] },
  internships: { type: Array, default: [] },
  skills: { type: Array, default: [] },
  exams: { type: Array, default: [] },
  updatedAt: { type: Date, default: Date.now }
});
const UserProfile = mongoose.model('UserProfile', userProfileSchema);

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  salary: String,
  type: { type: String, enum: ['IT', 'Non-IT', 'Internship', 'Startup', 'Competitive'] },
  skills: [String],
  description: String,
  url: String,
  postedAt: { type: Date, default: Date.now }
});
const Job = mongoose.model('Job', jobSchema);

// Worker: Runs every minute
cron.schedule('* * * * *', async () => {
  const tasks = await AutomationTask.find({ isActive: true });
  const now = new Date();

  for (const task of tasks) {
    let shouldSend = false;

    if (!task.lastSentAt) {
      shouldSend = true;
    } else {
      const diffMs = now - new Date(task.lastSentAt);
      const diffMins = diffMs / (1000 * 60);

      if (task.frequencyType === 'interval') {
        if (diffMins >= task.frequencyValue) shouldSend = true;
      } else if (task.frequencyType === 'daily') {
        const intervalMins = (24 * 60) / task.frequencyValue;
        if (diffMins >= intervalMins) shouldSend = true;
      }
    }

    if (shouldSend) {
      try {
        console.log(`[Automation] Sending email to ${task.hrEmail} for ${task.companyName}...`);
        
        const mailOptions = {
          from: '"TalentIQS Automation" <automation@talentiqs.com>',
          to: task.hrEmail,
          subject: `Job Application - ${task.companyName}`,
          text: task.emailContent,
          attachments: [
            {
              filename: 'resume.pdf',
              path: task.resumePath
            }
          ]
        };

        // For simulation, we log. Uncomment for real usage.
        // await transporter.sendMail(mailOptions);
        
        task.lastSentAt = now;
        task.totalSent += 1;
        await task.save();
        console.log(`[Automation] Success: Email sent to ${task.hrEmail}`);
      } catch (err) {
        console.error(`[Automation] Failed for ${task.hrEmail}:`, err);
      }
    }
  }
});

// ─── PDF Text Extraction ──────────────────────────────────────────────────────
async function extractPdfText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (err) {
    console.error("❌ PDF Extraction Error:", err);
    throw new Error(`PDF extraction failed: ${err.message}`);
  }
}

// ─── Get All Job Collections ───────────────────────────────────────────────────
async function getJobCollections(db) {
  const collections = await db.listCollections().toArray();
  const jobCols = collections.filter(c =>
    c.name.toLowerCase().includes('job') ||
    c.name.toLowerCase().includes('naukri') ||
    c.name.toLowerCase().includes('linkedin') ||
    c.name.toLowerCase().includes('career') ||
    c.name.toLowerCase().includes('vacancy')
  );
  if (jobCols.length === 0 && collections.length > 0) {
    return [collections[0].name]; // fallback to first collection
  }
  return jobCols.map(c => c.name);
}

// ─── Smart MongoDB Job Search ─────────────────────────────────────────────────
async function searchJobsByKeyPoints(mongooseConn, keyPoints) {
  const targetDatabases = ['linkdinjob', 'talentiqs', 'linkedin_scraper'];
  let allJobs = [];

  // Build search terms from key points
  const skills = keyPoints.skills || [];
  const roles  = keyPoints.roles  || [];
  const domains = keyPoints.domains || [];

  const allTerms = [...skills, ...roles, ...domains].filter(Boolean);
  const searchStr = allTerms.join(' ');

  for (const dbName of targetDatabases) {
    const db = mongooseConn.useDb(dbName).db;
    const colNames = await getJobCollections(db);
    console.log(`📂 Found collections in [${dbName}]:`, colNames);

    for (const colName of colNames) {
      const col = db.collection(colName);
      let jobs = [];

      // Strategy 1: text index search
      try {
        jobs = await col.find(
          { $text: { $search: searchStr } },
          { score: { $meta: 'textScore' } }
        ).sort({ score: { $meta: 'textScore' } }).limit(40).toArray();
      } catch {
        // text index may not exist, use regex
      }

      // Strategy 2: regex search if text search returned nothing
      if (jobs.length === 0 && allTerms.length > 0) {
        const regexPatterns = allTerms.slice(0, 10).map(t => new RegExp(t, 'i'));
        const orClauses = regexPatterns.flatMap(r => [
          { title: r },
          { Job_Title: r },
          { role: r },
          { position: r },
          { description: r },
          { Job_Description: r },
          { skills: r },
          { Skills: r },
          { tags: r },
        ]);
        jobs = await col.find({ $or: orClauses }).limit(40).toArray();
      }

      // Strategy 3: fallback — grab recent jobs if still empty
      if (jobs.length === 0) {
        jobs = await col.find({}).limit(20).toArray();
      }

      // Add database source identifier to each job for tracing
      jobs = jobs.map(j => ({ ...j, dbSource: dbName }));
      allJobs = allJobs.concat(jobs);
    }
  }

  // Deduplicate by _id
  const seen = new Set();
  const unique = allJobs.filter(j => {
    const key = String(j._id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`🔍 Found ${unique.length} candidate jobs in total from all databases`);
  return unique;
}

// ─── Normalize Job Document ───────────────────────────────────────────────────
function normalizeJob(j) {
  return {
    id:          String(j._id),
    title:       j.title       || j.Job_Title    || j.role         || j.position    || 'Unknown Title',
    company:     j.company     || j.Company      || j.company_name || j.employer    || 'Unknown Company',
    location:    j.location    || j.Location     || j.city         || '',
    description: (j.description || j.Job_Description || j.summary || j.details || '').substring(0, 500),
    skills:      j.skills      || j.Skills       || j.tags         || j.requirements || [],
    salary:      j.salary      || j.Salary       || j.ctc          || j.CTC         || '',
    experience:  j.experience  || j.Experience   || j.exp          || '',
    source:      j.source      || j.Source       || j.platform     || '',
    url:         j.url         || j.job_url      || j.link         || '',
    postedAt:    j.postedAt    || j.posted_date  || j.date         || '',
  };
}


// ─── TAILOR RESUME ENDPOINT ────────────────────────────────────────────────
app.post('/api/tailor-resume', async (req, res) => {
  const { job, keyPoints } = req.body;
  if (!job || !keyPoints) return res.status(400).json({ error: "Missing job or keyPoints data" });
  
  try {
    const prompt = `
You are an expert Executive Resume Writer. 
Rewrite the candidate's resume summary and experience to perfectly match the target job, maximizing ATS keywords while keeping it truthful based on their actual key points.

Target Job Title: ${job.title}
Target Company: ${job.company}
Job Description/Skills: ${job.description}
Missing Skills to address or work around: ${job.missingSkills?.join(', ')}

Candidate Profile:
${JSON.stringify(keyPoints, null, 2)}

Return ONLY valid JSON in this exact format (no markdown, no preamble):
{
  "tailored_summary": "A highly optimized professional summary...",
  "tailored_skills_section": "Optimized comma-separated list of skills perfectly ordered for this job",
  "tailored_experience_bullets": [
    "Action-verb driven bullet point showcasing relevant impact.",
    "Another optimized bullet point focusing on requested skills."
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const tailored = JSON.parse(response.choices[0].message.content);
    res.json(tailored);
  } catch (error) {
    console.error("❌ Tailor Error:", error);
    res.status(500).json({ error: "Failed to tailor resume" });
  }
});

// ─── USER PROFILE: CAREER RECOMMENDATIONS ────────────────────────────────────
app.post('/api/career-recommendations', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No resume uploaded" });
  res.setHeader("Content-Type", "application/json");

  let text = '';
  const file = req.file;
  const mime = file.mimetype;

  try {
    if (mime === 'application/pdf') {
      text = await extractPdfText(file.path);
    } else if (mime.includes('wordprocessingml') || mime === 'application/msword') {
      const result = await mammoth.extractRawText({ path: file.path });
      text = result.value;
    } else if (mime.startsWith('image/')) {
      const result = await Tesseract.recognize(file.path, 'eng');
      text = result.data.text;
    } else {
      return res.status(400).json({ error: "Unsupported file format." });
    }
  } catch (err) {
    return res.status(500).json({ error: `Text extraction failed: ${err.message}` });
  } finally {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
  }

  if (!text || text.trim().length < 50) return res.status(400).json({ error: "Could not extract enough text from the file." });

  try {
    const prompt = `
You are an expert Career Counselor AI. Analyze the following resume text and determine their professional field and exact experience level.
Then, recommend standard, industry-recognized paths strictly tailored to their profile:
1. Top 5 exact Professional Certificates they should pursue to advance.
2. Top 5 specific Professional Courses (e.g. specific Udemy/Coursera topics).
3. Top 3 Professional Exams or Board Exams relevant to them.
4. Top 3 common, challenging technical interview questions they should prepare for.
5. A realistic expected salary range for their level and field.

Resume Text:
${text.substring(0, 5000)}

Return ONLY valid JSON in this exact format:
{
  "determined_field": "e.g. Cloud Engineering",
  "determined_level": "e.g. Mid-Level",
  "certificates": ["AWS Certified Solutions Architect", "CKA: Certified Kubernetes Administrator"],
  "courses": ["Advanced React Patterns", "Docker Mastery"],
  "exams": ["CompTIA Security+", "Cisco CCNA"],
  "interview_questions": ["Explain how the NodeJS event loop works.", "What is the difference between TCP and UDP?"],
  "salary_expectations": "$120,000 - $150,000"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const recommendations = JSON.parse(response.choices[0].message.content);
    // Return both recommendations and the raw text for the reconstruction phase later
    res.json({ ...recommendations, rawResumeText: text });
  } catch (error) {
    console.error("❌ Career Recommendations Error:", error);
    res.status(500).json({ error: "Failed to generate recommendations." });
  }
});

// ─── USER PROFILE: RECONSTRUCT RESUME ──────────────────────────────────────
app.post('/api/reconstruct-resume', async (req, res) => {
  const { resumeText, targetPath } = req.body;
  if (!resumeText || !targetPath) return res.status(400).json({ error: "Missing resumeText or targetPath" });

  try {
    const prompt = `
You are an expert Executive Resume Reconstructor. 
A candidate wants to pivot or strictly optimize their career path towards this exact target: "${targetPath}".
Rewrite their entire resume to focus intensely on skills, experiences, and metrics relevant to "${targetPath}".
Omit irrelevant details. Enhance their bullet points using action verbs and highlight transferrable skills.

Original Resume Text:
${resumeText.substring(0, 6000)}

Return ONLY valid JSON in this exact format (no markdown):
{
  "target_title": "Optimized Title related to ${targetPath}",
  "professional_summary": "Aggressive, highly-tailored summary for this path...",
  "core_competencies": ["Skill 1", "Skill 2"],
  "experience_bullets": [
    "Reconstructed bullet showcasing relevant skills for ${targetPath}.",
    "Another optimized bullet..."
  ]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const reconstructed = JSON.parse(response.choices[0].message.content);
    res.json(reconstructed);
  } catch (error) {
    console.error("❌ Reconstruct Resume Error:", error);
    res.status(500).json({ error: "Failed to reconstruct resume." });
  }
});

// ─── USER PROFILE: EXTRACT TEXT ONLY ─────────────────────────────────────────
app.post('/api/extract-text', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No resume uploaded" });
  let text = '';
  const file = req.file;
  const mime = file.mimetype;

  try {
    if (mime === 'application/pdf') {
       text = await extractPdfText(file.path);
    } else if (mime.includes('wordprocessingml') || mime === 'application/msword') {
       const result = await mammoth.extractRawText({ path: file.path });
       text = result.value;
    } else if (mime.startsWith('image/')) {
       const result = await Tesseract.recognize(file.path, 'eng');
       text = result.data.text;
    } else {
       return res.status(400).json({ error: "Unsupported file format." });
    }
  } catch (err) {
    return res.status(500).json({ error: `Text extraction failed: ${err.message}` });
  } finally {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
  }

  if (!text || text.trim().length < 50) return res.status(400).json({ error: "Could not extract enough text from the file." });

  res.json({ rawResumeText: text });
});

// ─── Health check & collection info ──────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const jobCols = await getJobCollections(db);
    const counts = {};
    for (const col of jobCols) {
      counts[col] = await db.collection(col).countDocuments();
    }
    res.json({ status: 'ok', allCollections: collections.map(c => c.name), jobCollections: jobCols, jobCounts: counts });
  } catch (err) {
    res.json({ status: 'error', error: err.message });
  }
});

// ─── AI GOAL GENERATION ──────────────────────────────────────────────────────
app.post('/api/generate-goals', async (req, res) => {
  const { profileData } = req.body;
  if (!profileData) {
    console.error("❌ generate-goals: No profile data provided");
    return res.status(400).json({ error: "Missing profileData" });
  }

  console.log(`🤖 AI: Generating goals for ${profileData.personal?.name || 'Anonymous'}...`);

  try {
    const prompt = `
You are an expert Career Coach. Based on this candidate's profile, generate 3 strategic professional goals.

Role: ${profileData.personal?.role || "Professional Candidate"}
Skills: ${(profileData.skills || []).join(', ') || "Technical Skills"}
Recent Experience: ${(profileData.experience || []).map(e => e.role).join(', ') || "Entry Level"}

Return a JSON object with:
"today": A concrete technical task for today.
"weekly": A milestone for the week.
"monthly": A high-level career growth objective.

IMPORTANT: Return ONLY the JSON object. No markdown.
{
  "today": "...",
  "weekly": "...",
  "monthly": "..."
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: "You are a professional career strategist." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const goals = JSON.parse(response.choices[0].message.content);
    console.log("✅ AI Goals successfully created:", goals);
    res.json(goals);
  } catch (error) {
    console.error("❌ AI Goal Generation Error:", error.message);
    res.status(500).json({ error: "AI failed to strategize goals. Please try again." });
  }
});

// ─── VERIFICATION ENDPOINTS ──────────────────────────────────────────────────

// 1. Send OTP
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore.set(email, { otp, expiry });

  console.log(`[OTP] Sent to ${email}: ${otp}`);

  // In a real scenario, we'd wait for this. 
  // For now, we simulate success and log to console if SMTP fails.
  try {
    const mailOptions = {
      from: '"TalentIQS Verification" <verification@talentiqs.com>',
      to: email,
      subject: 'Your Profile Verification Code',
      text: `Your verification code is: ${otp}. This code will expire in 5 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #B07D2E;">Profile Verification</h2>
          <p>Please use the following code to verify your TalentIQS profile:</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px; background: #FAF7F2; text-align: center; border-radius: 5px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">This code expires in 5 minutes.</p>
        </div>
      `
    };

    // If you have real credentials, uncomment this:
    // await transporter.sendMail(mailOptions);
    
    res.json({ success: true, message: "OTP sent successfully (Check console for mock)" });
  } catch (error) {
    console.error("Mailer Error:", error);
    res.json({ success: true, message: "OTP generated (Check console/logs)" });
  }
});

// 2. Verify OTP
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

  const stored = otpStore.get(email);

  if (!stored) {
    return res.status(400).json({ error: "No OTP found for this email. Please request a new one." });
  }

  if (Date.now() > stored.expiry) {
    otpStore.delete(email);
    return res.status(400).json({ error: "OTP expired. Please request a new one." });
  }

  if (stored.otp !== otp) {
    return res.status(400).json({ error: "Invalid OTP. Please try again." });
  }

  // Success!
  otpStore.delete(email);
  
  // Placeholder: Update user in DB
  // db.users.updateOne({ email }, { $set: { isVerified: true } })

  res.json({ success: true, message: "Profile verified successfully!" });
});

// 3. Create Automation Task
app.post('/api/automations', upload.single('resume'), async (req, res) => {
  const { hrEmail, companyName, emailContent, frequencyType, frequencyValue } = req.body;
  const file = req.file;

  if (!hrEmail || !companyName || !emailContent || !frequencyType || !frequencyValue || !file) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const task = new AutomationTask({
      hrEmail,
      companyName,
      resumePath: file.path,
      emailContent,
      frequencyType,
      frequencyValue: parseInt(frequencyValue),
    });

    await task.save();
    res.json({ success: true, message: "Automation task created and scheduled!" });
  } catch (err) {
    console.error("Task Creation Error:", err);
    res.status(500).json({ error: "Failed to create automation task" });
  }
});

// ─── GOAL & PROFILE ENDPOINTS ────────────────────────────────────────────────

// Get goals for a user
app.get('/api/goals/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const now = new Date();
    const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
    
    let goal = await Goal.findOne({ email, monthYear });
    if (!goal) {
      // Return empty but don't save yet
      return res.json({ today: "", weekly: "", monthly: "", monthYear });
    }
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save/Update goals
app.post('/api/goals', async (req, res) => {
  try {
    const { email, today, weekly, monthly } = req.body;
    const now = new Date();
    const monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;

    let goal = await Goal.findOne({ email, monthYear });
    if (goal) {
      goal.today = today;
      goal.weekly = weekly;
      goal.monthly = monthly;
      goal.updatedAt = now;
      await goal.save();
    } else {
      goal = new Goal({ email, today, weekly, monthly, monthYear });
      await goal.save();
    }
    res.json({ success: true, goal });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get profile
app.get('/api/profile/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const profile = await UserProfile.findOne({ email });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload Avatar
app.post('/api/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.file || !email) return res.status(400).json({ error: "File and email required" });
    
    const avatarUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    await UserProfile.findOneAndUpdate(
      { email },
      { $set: { avatarUrl } },
      { upsert: true }
    );
    
    res.json({ success: true, avatarUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Static serving of uploads
app.use('/uploads', express.static('uploads'));

// Save profile (Sync from Resume or Manual Edit)
app.post('/api/profile', async (req, res) => {
  try {
    const { email, personal, education, experience, internships, skills, exams, avatarUrl } = req.body;
    let profile = await UserProfile.findOne({ email });
    
    if (profile) {
      profile.personal = personal || profile.personal;
      profile.education = education || profile.education;
      profile.experience = experience || profile.experience;
      profile.internships = internships || profile.internships;
      profile.skills = skills || profile.skills;
      profile.exams = exams || profile.exams;
      profile.avatarUrl = avatarUrl || profile.avatarUrl;
      profile.updatedAt = new Date();
      await profile.save();
    } else {
      profile = new UserProfile({ email, personal, education, experience, internships, skills, exams, avatarUrl });
      await profile.save();
    }
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── JOB DATABASE SEEDING ──────────────────────────────────────────────────
app.post('/api/seed-jobs', async (req, res) => {
  const seedJobs = [
    { title: "Senior React Developer", company: "Meta", location: "Menlo Park, CA", salary: "$180k - $240k", type: "IT", skills: ["React", "JavaScript", "TypeScript", "Node.js"], url: "https://meta.com/jobs" },
    { title: "Backend Engineer", company: "Amazon", location: "Seattle, WA", salary: "$160k - $210k", type: "IT", skills: ["Java", "Spring Boot", "AWS", "SQL"], url: "https://amazon.jobs" },
    { title: "DevOps Architect", company: "Google", location: "Mountain View, CA", salary: "$200k - $280k", type: "IT", skills: ["Kubernetes", "Docker", "Terraform", "GCP"], url: "https://google.com/jobs" },
    { title: "Frontend Intern", company: "Vercel", location: "Remote", salary: "$40/hr", type: "Internship", skills: ["Next.js", "React", "CSS", "Tailwind"], url: "https://vercel.com/jobs" },
    { title: "Product Manager", company: "Stripe", location: "San Francisco, CA", salary: "$150k - $220k", type: "Startup", skills: ["Product Strategy", "Agile", "SQL"], url: "https://stripe.com/jobs" },
    { title: "AI Research Scientist", company: "OpenAI", location: "San Francisco, CA", salary: "$250k - $400k", type: "IT", skills: ["Python", "PyTorch", "Transformers", "LLMs"], url: "https://openai.com/jobs" },
    { title: "Marketing Specialist", company: "HubSpot", location: "Boston, MA", salary: "$80k - $120k", type: "Non-IT", skills: ["SEO", "Content Strategy", "HubSpot"], url: "https://hubspot.com/jobs" }
  ];

  try {
    await Job.deleteMany({});
    await Job.insertMany(seedJobs);
    res.json({ success: true, message: "Job database seeded successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── RESUME ANALYSIS PIPELINE ──────────────────────────────────────────────
app.post('/api/analyze-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    let resumeText = "";
    const mime = req.file.mimetype;

    if (mime === 'application/pdf') {
      resumeText = await extractPdfText(req.file.path);
    } else if (mime.includes('wordprocessingml') || mime === 'application/msword') {
      const result = await mammoth.extractRawText({ path: req.file.path });
      resumeText = result.value;
    } else if (mime.startsWith('image/')) {
      const result = await Tesseract.recognize(req.file.path, 'eng');
      resumeText = result.data.text;
    } else {
       return res.status(400).json({ error: "Unsupported file format." });
    }

    // 1. Extract Key Points using AI
    const analysisPrompt = `
Analyze this resume text and extract key information. 
Resume Text: ${resumeText}

Return JSON:
{
  "name": "Full Name",
  "email": "Email",
  "phone": "Phone",
  "location": "City/Country",
  "role": "Current/Target Role",
  "skills": ["Skill1", "Skill2", ...],
  "experience": [{"company": "...", "role": "...", "duration": "..."}],
  "education": [{"institution": "...", "degree": "...", "year": "..."}],
  "ats_score": 0-100,
  "isAtsFriendly": boolean,
  "atsTips": ["Tip 1 to improve ATS compatibility if false", "Tip 2..."]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: analysisPrompt }],
      response_format: { type: "json_object" }
    });

    const keyPoints = JSON.parse(completion.choices[0].message.content);
    const { category } = req.body;

    // 2. Fetch Matched Jobs from DATABASE with category filter
    const query = {
      $and: [
        { $or: [
            { title: new RegExp(keyPoints.role, 'i') },
            { skills: { $in: (keyPoints.skills || []).map(s => new RegExp(s, 'i')) } }
        ]}
      ]
    };

    if (category) {
      query.$and.push({ type: category });
    }

    const matchedJobs = await Job.find(query).limit(10);

    // 3. Score and Analyze each job against the resume
    const detailedMatches = await Promise.all(matchedJobs.map(async (job) => {
      const matchPrompt = `
Compare this resume to the job description.
Resume Skills: ${keyPoints.skills.join(', ')}
Job Title: ${job.title}
Job Skills: ${job.skills.join(', ')}

Return JSON:
{
  "matchScore": 0-100,
  "relevanceReasons": ["Reason1", "Reason2"],
  "missingSkills": ["Skill1", "Skill2"],
  "mismatchExplanation": "Why is it not a 100% match?"
}`;
      
      const matchComp = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: matchPrompt }],
        response_format: { type: "json_object" }
      });
      
      const analysis = JSON.parse(matchComp.choices[0].message.content);
      return { 
        ...job.toObject(), 
        matchScore: analysis.matchScore,
        relevanceReasons: analysis.relevanceReasons,
        missingSkills: analysis.missingSkills,
        mismatchExplanation: analysis.mismatchExplanation
      };
    }));

    detailedMatches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      keyPoints,
      matchedJobs: detailedMatches,
      totalFound: detailedMatches.length
    });

  } catch (error) {
    console.error("❌ Analysis Error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
  }
});

// ─── PREPARATION GUIDE GENERATION ──────────────────────────────────────────
app.post('/api/prepare-guide', async (req, res) => {
  const { job, profileData } = req.body;
  
  console.log("🚀 [PREPARE] Request received for:", job?.title, "at", job?.company);

  if (!job || !profileData) {
    console.error("❌ [PREPARE] Missing job or profileData");
    return res.status(400).json({ error: "Missing required data for preparation guide." });
  }

  try {
    const prompt = `
As a Senior Career Strategist, generate a custom interview preparation guide.

JOB DETAILS:
Title: ${job.title}
Company: ${job.company}
Target Skills: ${(job.skills || []).join(', ')}

CANDIDATE DETAILS:
Role: ${profileData.personal?.role || "Professional"}
Skills: ${(profileData.skills || []).join(', ')}

Output MUST be a JSON object with these EXACT keys:
- "gaps": Array of missing technical skills.
- "focusTopics": Array of top interview topics for this company.
- "newTech": Array of technologies in the JD that are new to the candidate.
- "certificates": Array of suggested certifications.
- "suggestedProjects": Array of 2 project ideas to build.
- "hackerRankLevel": String describing required competitive level.
- "languages": Array of must-master languages.
- "roadmap": Array of 3 specific action steps.

Return ONLY the JSON object. No markdown, no commentary.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional JSON generator for career guidance. Return only valid JSON." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const rawContent = completion.choices[0].message.content;
    console.log("🤖 [PREPARE] AI Response received");

    try {
      const guide = JSON.parse(rawContent);
      console.log("✅ [PREPARE] Guide generated successfully");
      res.json(guide);
    } catch (parseError) {
      console.error("❌ [PREPARE] JSON Parse Error:", parseError.message);
      console.error("📄 [PREPARE] Raw Content:", rawContent);
      res.status(500).json({ error: "AI returned invalid data format." });
    }

  } catch (error) {
    console.error("❌ [PREPARE] API Error:", error.message);
    res.status(500).json({ error: "Strategic analysis failed. Please check your connection." });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
