import { useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Lightbulb,
  ChevronRight,
  Loader2,
} from "lucide-react";
import GridScan from "../components/GridScan";

// ─── Mock data keyed by company id ──────────────────────────────────────────
const COMPANY_DATA = {
  google: {
    name: "Google",
    color: "#4285F4",
    matchScore: 62,
    missingSkills: [
      "System Design at scale (distributed systems)",
      "Go or Kotlin proficiency",
      "Data Structures – advanced graph algorithms",
      "Kubernetes / container orchestration",
      "Experience with large-scale data pipelines",
    ],
    certifications: [
      { name: "Google Professional Cloud Architect", priority: "High" },
      { name: "Google Professional Data Engineer", priority: "High" },
      { name: "LeetCode 200+ Mediums/Hards", priority: "High" },
      { name: "TensorFlow Developer Certificate", priority: "Medium" },
    ],
    tips: [
      "Quantify every impact — add numbers to all bullet points (e.g. 'reduced latency by 40%').",
      "Add a 'Projects' section with links to GitHub; Google engineers love seeing shipped code.",
      "Remove all objective statements; use a 3-line professional summary instead.",
      "Highlight cross-functional collaboration experiences — Google values 'Googliness'.",
      "Include open-source contributions if any; even small PRs matter a lot.",
    ],
    strengths: [
      "Strong Python / programming fundamentals",
      "Demonstrated problem-solving skills",
    ],
  },
  amazon: {
    name: "Amazon",
    color: "#FF9900",
    matchScore: 55,
    missingSkills: [
      "AWS core services: EC2, S3, Lambda, DynamoDB",
      "Leadership Principles alignment in bullet points",
      "Microservices architecture experience",
      "CI/CD pipeline design experience",
      "Java or Scala proficiency",
    ],
    certifications: [
      { name: "AWS Certified Solutions Architect – Associate", priority: "High" },
      { name: "AWS Certified Developer – Associate", priority: "High" },
      { name: "AWS Certified SysOps Administrator", priority: "Medium" },
    ],
    tips: [
      "Frame every bullet point using the STAR method — Amazon interviewers map resume lines to Leadership Principles.",
      "Add specific \"Ownership\" examples — show times you went beyond your role.",
      "Include metrics for delivered impact in every position (e.g. improved throughput, reduced costs).",
      "Showcase experience with high-traffic systems or customer-facing platforms.",
    ],
    strengths: [
      "Clear work history progression",
      "Shows full project lifecycle ownership",
    ],
  },
  microsoft: {
    name: "Microsoft",
    color: "#00A4EF",
    matchScore: 68,
    missingSkills: [
      "Azure cloud services experience",
      "C# / .NET proficiency",
      "DevOps practices (Azure DevOps, GitHub Actions)",
      "TypeScript / React for full-stack roles",
      "Experience with enterprise-scale software",
    ],
    certifications: [
      { name: "Microsoft Azure Fundamentals (AZ-900)", priority: "High" },
      { name: "Azure Administrator Associate (AZ-104)", priority: "High" },
      { name: "Microsoft Certified: DevOps Engineer Expert", priority: "Medium" },
    ],
    tips: [
      "Show growth mindset by including learning projects and self-improvement courses.",
      "Emphasize collaboration and empathy — Microsoft values inclusive team players.",
      "Include experience with large codebases and enterprise software development.",
    ],
    strengths: ["Solid general cloud awareness", "Good communication skills in resume"],
  },
  meta: {
    name: "Meta",
    color: "#0081FB",
    matchScore: 58,
    missingSkills: [
      "React / React Native proficiency",
      "C++ or Hack language experience",
      "Large-scale systems design knowledge",
      "ML/AI application experience",
      "Experience with real-time systems",
    ],
    certifications: [
      { name: "Meta Certified Developer (Facebook Blueprint)", priority: "Medium" },
      { name: "LeetCode Hard Streak (50+ questions)", priority: "High" },
      { name: "PyTorch / ML Fundamentals Certificate", priority: "Medium" },
    ],
    tips: [
      "Demonstrate 'Move Fast' culture alignment — show rapid iteration and shipping speed.",
      "Include social impact metrics — show how your work affected real users.",
      "Add experience with A/B testing and product experimentation frameworks.",
    ],
    strengths: ["Frontend experience visible", "Shows user-centric thinking"],
  },
  jpmorgan: {
    name: "JPMorgan Chase",
    color: "#005B8E",
    matchScore: 45,
    missingSkills: [
      "Financial modeling & valuation",
      "SQL and data analysis at scale",
      "Regulatory compliance knowledge (Basel III, GDPR)",
      "Python for quantitative analysis",
      "Risk management frameworks",
    ],
    certifications: [
      { name: "CFA Level 1", priority: "High" },
      { name: "FRM (Financial Risk Manager)", priority: "High" },
      { name: "Bloomberg Market Concepts (BMC)", priority: "High" },
      { name: "SQL / Data Analysis Certification", priority: "Medium" },
    ],
    tips: [
      "Add any finance coursework, internships, or trading simulations prominently.",
      "Show analytical rigor — quantify business impact with dollar values where possible.",
      "Include leadership roles in finance clubs, case competitions, or hackathons.",
    ],
    strengths: ["Strong analytical background", "Communication skills are clear"],
  },
  mckinsey: {
    name: "McKinsey & Company",
    color: "#2B6CB0",
    matchScore: 50,
    missingSkills: [
      "Structured problem solving (MECE frameworks)",
      "Case study interview preparation",
      "Data-driven storytelling and slide creation",
      "Client-facing communication experience",
      "Industry expertise in 1-2 verticals",
    ],
    certifications: [
      { name: "Case Interview Preparation (CaseCoach/RocketBlocks)", priority: "High" },
      { name: "Excel / PowerPoint Advanced Certification", priority: "Medium" },
      { name: "MBA or Top Graduate Program", priority: "Medium" },
    ],
    tips: [
      "Every bullet point should show impact, not just responsibilities (use 'Led, Drove, Delivered').",
      "Add consulting or case competition experience prominently.",
      "Demonstrate cross-industry analytical capabilities.",
    ],
    strengths: ["Leadership examples visible", "Academic achievements strong"],
  },
  goldman: {
    name: "Goldman Sachs",
    color: "#6B46C1",
    matchScore: 48,
    missingSkills: [
      "Financial instruments knowledge (derivatives, fixed income)",
      "Python/R for quantitative analysis",
      "Bloomberg Terminal proficiency",
      "Risk management understanding",
      "Regulatory knowledge (Dodd-Frank, MiFID II)",
    ],
    certifications: [
      { name: "CFA Level 1", priority: "High" },
      { name: "Financial Modeling & Valuation Analyst (FMVA)", priority: "High" },
      { name: "Bloomberg Market Concepts", priority: "High" },
    ],
    tips: [
      "Highlight any finance internship, research, or investment club experience.",
      "Show quantitative reasoning ability with data-backed bullet points.",
      "Demonstrate high-pressure environment experience.",
    ],
    strengths: ["Strong academic record", "Shows attention to detail"],
  },
  startup: {
    name: "Early-Stage Startup",
    color: "#D8C9AE",
    matchScore: 72,
    missingSkills: [
      "Full-stack development experience",
      "Exposure to the full product lifecycle",
      "Growth hacking / marketing fundamentals",
      "No-code / rapid prototyping tools",
      "Startup ecosystem knowledge",
    ],
    certifications: [
      { name: "Y Combinator Startup School (free)", priority: "High" },
      { name: "Product Management Certificate (PM School)", priority: "Medium" },
      { name: "Growth Marketing Certificate (Reforge)", priority: "Medium" },
    ],
    tips: [
      "Show bias for action — list side projects, freelance work, or hackathon wins.",
      "Demonstrate adaptability and wearing multiple hats.",
      "Include any experience with limited resources but high output.",
    ],
    strengths: ["Self-starter attitude visible", "Diverse skills across disciplines"],
  },
  infosys: {
    name: "Infosys / TCS / Wipro",
    color: "#38BDF8",
    matchScore: 75,
    missingSkills: [
      "ITIL / Service Management knowledge",
      "SAP / ERP system experience",
      "Java Enterprise Edition (J2EE)",
      "Testing methodologies (Selenium, ISTQB)",
      "Client communication and SLAs",
    ],
    certifications: [
      { name: "ISTQB Foundation Level", priority: "High" },
      { name: "AWS Certified Cloud Practitioner", priority: "Medium" },
      { name: "Oracle Java SE Certified Associate", priority: "Medium" },
      { name: "ITIL v4 Foundation", priority: "Medium" },
    ],
    tips: [
      "Highlight communication and teamwork — service roles require strong interpersonal skills.",
      "Add any client project experience, even academic or internship level.",
      "Show process orientation: following SDLC, Agile, or waterfall methodology.",
    ],
    strengths: ["Good foundational technical knowledge", "Team experience established"],
  },
};

const DEFAULT_DATA = {
  name: "Your Target Company",
  color: "#D8C9AE",
  matchScore: 60,
  missingSkills: ["Domain expertise", "Industry tools", "Certifications", "Specific frameworks"],
  certifications: [{ name: "Industry Relevant Certificate", priority: "High" }],
  tips: ["Quantify all bullet points.", "Tailor keywords to the job description.", "Add measurable achievements."],
  strengths: ["Good foundation", "Relevant experience"],
};

const PRIORITY_COLOR = { High: "#F87171", Medium: "#FBBF24", Low: "#34D399" };

function CircleScore({ score, color }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#ffffff08" strokeWidth="8" />
        <motion.circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-light text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {score}%
        </motion.span>
        <span className="text-xs text-[#B0ACA5]">Match</span>
      </div>
    </div>
  );
}

export default function AnalysisDashboard() {
  const { companyId } = useParams();
  const data = COMPANY_DATA[companyId] || DEFAULT_DATA;

  const [stage, setStage] = useState("upload"); // upload | analyzing | results
  const [fileName, setFileName] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file) return;
    setFileName(file.name);
    setStage("analyzing");
    setTimeout(() => setStage("results"), 3200);
  }, []);

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  return (
    <div className="min-h-screen relative flex flex-col bg-[#0D0D0D] overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50">
        <GridScan
          sensitivity={0.3}
          lineThickness={1}
          linesColor="#333"
          scanColor={data.color}
          scanOpacity={0.15}
          gridScale={0.08}
          scanDirection="pingpong"
          scanGlow={0.3}
          scanDuration={3}
          scanDelay={4}
          scanOnClick={false}
        />
      </div>
      {/* Color orb behind panel */}
      <div
        className="absolute top-[5%] right-[5%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none z-0 opacity-10"
        style={{ backgroundColor: data.color }}
      />

      <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-4 border"
            style={{ color: data.color, borderColor: `${data.color}40`, backgroundColor: `${data.color}10` }}
          >
            {data.name}
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-white mb-3">Resume Gap Analysis</h1>
          <p className="text-[#B0ACA5] font-light">
            Upload your resume below to see exactly how you match against {data.name}'s hiring bar.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* ── UPLOAD STAGE ── */}
          {stage === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current.click()}
                className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-16 flex flex-col items-center justify-center text-center ${
                  dragging
                    ? "border-[#D8C9AE]/60 bg-white/[0.04]"
                    : "border-white/10 hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.03]"
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border border-white/10"
                  style={{ backgroundColor: `${data.color}15`, color: data.color }}
                >
                  <Upload className="w-9 h-9" />
                </div>
                <h2 className="text-2xl font-light text-white mb-2">Drop your resume here</h2>
                <p className="text-[#B0ACA5] text-sm font-light mb-6">
                  PDF, DOC, or DOCX — up to 10 MB
                </p>
                <button
                  className="h-11 px-8 rounded-full text-sm font-medium border transition-all duration-300 hover:bg-white/5"
                  style={{ borderColor: `${data.color}50`, color: data.color }}
                >
                  Browse Files
                </button>
              </div>
            </motion.div>
          )}

          {/* ── ANALYZING STAGE ── */}
          {stage === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-8 border"
                style={{ backgroundColor: `${data.color}15`, borderColor: `${data.color}30` }}
              >
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: data.color }} />
              </div>
              <h2 className="text-3xl font-light text-white mb-3">Analyzing your resume…</h2>
              <p className="text-[#B0ACA5] font-light max-w-md">
                We're comparing <span className="text-white/80">{fileName}</span> against {data.name}'s
                hiring criteria, required skills, and ideal candidate profiles.
              </p>
              {/* Animated step labels */}
              <div className="mt-10 space-y-2 text-left w-72">
                {["Parsing resume content…", "Checking skills against role requirements…", "Generating personalized gap report…"].map(
                  (step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.9 + 0.3 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: data.color }} />
                      <span className="text-[#B0ACA5]">{step}</span>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* ── RESULTS STAGE ── */}
          {stage === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Top Row: Score + Strengths */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Match Score */}
                <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center">
                  <p className="text-xs text-[#B0ACA5] tracking-widest uppercase mb-4">Overall Match Score</p>
                  <CircleScore score={data.matchScore} color={data.color} />
                  <p className="mt-4 text-sm text-[#B0ACA5] text-center font-light">
                    Your resume currently matches <strong className="text-white">{data.matchScore}%</strong> of{" "}
                    {data.name}'s requirements.
                  </p>
                </div>

                {/* Strengths */}
                <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-5">
                    <CheckCircle className="w-5 h-5" style={{ color: data.color }} />
                    <h3 className="text-white font-medium">What you already have</h3>
                  </div>
                  <div className="space-y-3">
                    {data.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: data.color }} />
                        <p className="text-[#B0ACA5] text-sm font-light">{s}</p>
                      </div>
                    ))}
                  </div>

                  {/* Re-analyze button */}
                  <button
                    onClick={() => { setStage("upload"); setFileName(null); }}
                    className="mt-8 w-full h-10 rounded-xl border border-white/10 text-[#B0ACA5] text-xs hover:border-white/20 hover:text-white transition-all duration-300"
                  >
                    ↑ Upload a different resume
                  </button>
                </div>
              </div>

              {/* Missing Skills */}
              <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-6">
                  <XCircle className="w-5 h-5 text-[#F87171]" />
                  <h3 className="text-white font-medium">Missing Skills & Experience</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {data.missingSkills.map((skill, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#F87171]/5 border border-[#F87171]/10"
                    >
                      <ChevronRight className="w-4 h-4 text-[#F87171] flex-shrink-0" />
                      <span className="text-sm text-[#E5E5E5] font-light">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="w-5 h-5" style={{ color: data.color }} />
                  <h3 className="text-white font-medium">Recommended Certifications</h3>
                </div>
                <div className="space-y-3">
                  {data.certifications.map((cert, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${data.color}15` }}>
                          <Award className="w-4 h-4" style={{ color: data.color }} />
                        </div>
                        <span className="text-sm text-[#E5E5E5] font-light">{cert.name}</span>
                      </div>
                      <span
                        className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                        style={{
                          color: PRIORITY_COLOR[cert.priority],
                          backgroundColor: `${PRIORITY_COLOR[cert.priority]}15`,
                        }}
                      >
                        {cert.priority}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Improvement Tips */}
              <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2 mb-6">
                  <Lightbulb className="w-5 h-5 text-[#FBBF24]" />
                  <h3 className="text-white font-medium">Improvement Tips</h3>
                </div>
                <div className="space-y-4">
                  {data.tips.map((tip, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-xl border border-[#FBBF24]/10 bg-[#FBBF24]/[0.03]"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#FBBF24]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-[#FBBF24]">{i + 1}</span>
                      </div>
                      <p className="text-sm text-[#B0ACA5] font-light leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Action CTA */}
              <div className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-5 h-5" style={{ color: data.color }} />
                    <h3 className="text-white font-medium">Ready to improve?</h3>
                  </div>
                  <p className="text-sm text-[#B0ACA5] font-light">
                    Work through the certifications and tips above to close your gaps and significantly raise your match score.
                  </p>
                </div>
                <button
                  onClick={() => { setStage("upload"); setFileName(null); }}
                  className="flex-shrink-0 h-12 px-8 rounded-full text-sm font-medium border transition-all duration-300 hover:brightness-110"
                  style={{ borderColor: `${data.color}60`, color: data.color, backgroundColor: `${data.color}10` }}
                >
                  Re-Analyze →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
