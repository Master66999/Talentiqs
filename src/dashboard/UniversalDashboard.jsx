import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Upload, CheckCircle,
  Loader2, MapPin, DollarSign,
  ChevronDown, ChevronUp,
  Brain, Target, Activity, Wand2, ArrowRight
} from "lucide-react";
import { useResumeData } from "../context/ResumeDataContext";
import PrepareModal from "../components/PrepareModal";
import AtsCheckerSection from "../components/AtsCheckerSection";
import { useAuth } from "../context/AuthContext";

// --- Design Tokens ---
const T = {
  cream: "#FBF9F4",
  white: "#FFFFFF",
  gold: "#B07D2E",
  emerald: "#10B981",
  rose: "#F43F5E",
  border: "#E2DDD2",
  sans: "'Plus Jakarta Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

const CATEGORY_CONFIG = {
  "it": { title: "IT Professional", accent: T.gold, description: "Software development and infrastructure analysis." },
  "non-it": { title: "Non-IT Professional", accent: "#6B8F71", description: "General industry and management analysis." },
  "competitive": { title: "Competitive Exams", accent: "#8B1D1D", description: "Government post eligibility analysis." },
  "startup": { title: "Startup & Product", accent: "#C4705A", description: "Venture-backed and product role analysis." },
  "internship": { title: "Student Internship", accent: "#4285F4", description: "Entry-level and internship validation." }
};

function MetricCard({ title, value, subtitle, icon: Icon, color, dark = false }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-6 rounded-2xl border bg-white shadow-sm"
      style={{ borderColor: T.border }}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</span>
        {Icon && <Icon size={14} className="text-gray-400" />}
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-4xl font-black text-gray-900 leading-none">{value}</h3>
        {subtitle && <span className="text-[10px] font-bold" style={{ color }}>{subtitle}</span>}
      </div>
    </motion.div>
  );
}

function TechnicalSkillChart({ skills = [], missing = [], accent }) {
  const total = skills.length + missing.length || 1;
  const knownW = (skills.length / total) * 100;
  
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-gray-400 uppercase">Identified</span>
          <span className="text-[10px] font-bold text-gray-500">{skills.length} Detected</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${knownW}%` }} className="h-full" style={{ backgroundColor: accent }} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-gray-400 uppercase">Target Gaps</span>
          <span className="text-[10px] font-bold text-gray-500">{missing.length} Gaps</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${(missing.length / total) * 100}%` }} className="h-full bg-emerald-500/30" />
        </div>
      </div>
    </div>
  );
}

function JobCard({ job, onPrepare, onTailor, accent }) {
  const [expanded, setExpanded] = useState(false);
  const score = job.matchScore || 0;
  const color = score >= 80 ? T.emerald : score >= 60 ? T.gold : T.rose;

  return (
    <div className="bg-white border rounded-2xl overflow-hidden mb-4 hover:shadow-md transition-shadow" style={{ borderColor: T.border }}>
      <div className="p-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg" style={{ background: `${color}10`, color }}>
              {(job.company || "?").charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-black text-gray-900 mb-1 truncate">{job.title}</h3>
              <p className="text-sm font-bold text-gray-500">{job.company}</p>
              <div className="flex flex-wrap gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><MapPin size={12} /> {job.location || "Remote"}</span>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest"><DollarSign size={12} /> {job.salary || "Competitive"}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black" style={{ color }}>{score}%</div>
            <div className="text-[8px] font-bold tracking-widest uppercase opacity-40">Match</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-gray-50">
          <button onClick={() => setExpanded(!expanded)} className="text-[10px] font-black text-gray-400 hover:text-black flex items-center gap-1 bg-transparent border-none cursor-pointer uppercase tracking-widest">
            {expanded ? "Hide Details" : "View Details"} {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <div className="flex gap-2">
            <button onClick={() => onTailor(job)} className="px-4 py-2 rounded-lg font-black text-[10px] transition-all uppercase tracking-widest flex items-center gap-2" style={{ background: `${T.emerald}10`, color: T.emerald, border: `1px solid ${T.emerald}30` }}>
              <Wand2 size={12} /> Tailor
            </button>
            <button onClick={() => onPrepare(job)} className="px-4 py-2 rounded-lg font-black text-[10px] transition-all uppercase tracking-widest" style={{ background: `${accent}10`, color: accent, border: `1px solid ${accent}30` }}>Prepare</button>
            <a href={job.url} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg font-black text-[10px] bg-black text-white no-underline uppercase tracking-widest">Apply</a>
          </div>
        </div>
        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pt-6 grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="text-[9px] font-black text-emerald-600 mb-3 tracking-widest uppercase">Strengths</h4>
                  <ul className="space-y-1.5 list-none p-0 m-0">
                    {(job.relevanceReasons || []).map((r, i) => (
                      <li key={i} className="flex gap-2 text-xs font-bold text-gray-600"><CheckCircle size={12} className="text-emerald-500 shrink-0" /> {r}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <h4 className="text-[9px] font-black text-rose-600 mb-3 tracking-widest uppercase">Gaps</h4>
                  <p className="text-xs font-bold text-gray-600 leading-relaxed m-0">{job.mismatchExplanation || "Excellent alignment."}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TailorModal({ isOpen, onClose, job, keyPoints, accent }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (isOpen && job && keyPoints) {
      setLoading(true);
      fetch(`${API_URL}/api/tailor-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job, keyPoints })
      })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
    }
  }, [isOpen, job]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="p-8 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black tracking-tight">AI Tailoring Engine</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Optimizing for {job?.company}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 border-none bg-transparent cursor-pointer"><ArrowRight className="rotate-180" /></button>
        </div>
        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Rewriting your experience...</p>
            </div>
          ) : data ? (
            <div className="space-y-8">
              <section>
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Tailored Professional Summary</h4>
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-sm font-bold text-gray-800 leading-relaxed italic">
                  "{data.tailored_summary}"
                </div>
              </section>
              <section>
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">Optimized Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {data.tailored_skills_section.split(',').map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-tight">{s.trim()}</span>
                  ))}
                </div>
              </section>
              <section>
                <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4">High-Impact Bullet Points</h4>
                <div className="space-y-3">
                  {data.tailored_experience_bullets.map((b, i) => (
                    <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50 flex gap-3 text-xs font-bold text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                      {b}
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : <p className="text-center py-10">Tailoring failed. Try again.</p>}
        </div>
        <div className="p-8 border-t bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-200 bg-transparent border-none cursor-pointer">Close</button>
          <button className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest bg-emerald-500 text-white border-none cursor-pointer">Copy to Clipboard</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function UniversalDashboard({ category = "it" }) {
  const navigate = useNavigate();
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG["it"];
  const { profileData, updateProfileFromResume } = useResumeData();
  const { user } = useAuth();
  
  const [stage, setStage] = useState("upload");
  const [result, setResult] = useState(() => {
    const saved = localStorage.getItem(`analysis_${category}_${user?.email || 'guest'}`);
    return saved ? JSON.parse(saved) : null;
  });
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (result) {
      setStage("results");
      localStorage.setItem(`analysis_${category}_${user?.email || 'guest'}`, JSON.stringify(result));
    }
  }, [result, category, user]);

  const [prepModalOpen, setPrepModalOpen] = useState(false);
  const [tailorModalOpen, setTailorModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [prepGuide, setPrepGuide] = useState(null);
  const [prepLoading, setPrepLoading] = useState(false);
  const [prepError, setPrepError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handlePrepare = async (job) => {
    setCurrentJob(job);
    setPrepModalOpen(true);
    setPrepLoading(true);
    setPrepGuide(null);
    setPrepError(null);

    try {
      const res = await fetch(`${API_URL}/api/prepare-guide`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job, profileData }),
      });
      if (res.ok) setPrepGuide(await res.json());
      else setPrepError("Failed to strategize.");
    } catch (e) { setPrepError("Connection lost."); }
    finally { setPrepLoading(false); }
  };

  const handleTailor = (job) => {
    setCurrentJob(job);
    setTailorModalOpen(true);
  };

  const handleFile = async (file) => {
    if (!file) return;
    setFileName(file.name);
    setStage("analyzing");
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("category", category);

    try {
      const res = await fetch(`${API_URL}/api/analyze-resume`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
        updateProfileFromResume(data);
      } else setStage("error");
    } catch (e) { setStage("error"); }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {stage === "upload" && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center justify-center py-20">
             <div className="text-center mb-16">
               <h1 className="text-8xl font-black tracking-tighter mb-4" style={{ color: config.accent }}>{config.title}</h1>
               <p className="text-lg font-bold text-gray-500 max-w-md mx-auto">{config.description}</p>
             </div>
             <div 
               onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
               onDragLeave={() => setDragging(false)}
               onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
               onClick={() => fileRef.current.click()}
               className="w-full max-w-xl p-20 rounded-[40px] bg-white border-2 border-dashed transition-all cursor-pointer flex flex-col items-center hover:shadow-2xl"
               style={{ borderColor: dragging ? config.accent : T.border }}
             >
               <input ref={fileRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
               <Upload size={32} style={{ color: config.accent }} className="mb-6" />
               <h2 className="text-2xl font-black mb-2">Upload Resume</h2>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">PDF &middot; DOCX &middot; IMAGE</p>
             </div>
          </motion.div>
        )}

        {stage === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-40">
            <Loader2 size={48} className="animate-spin text-black mb-8" />
            <h2 className="text-3xl font-black">Analyzing Profile...</h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-4">Cross-referencing with industry benchmarks</p>
          </div>
        )}

        {stage === "results" && result && (
          <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <header className="flex items-end justify-between border-b pb-12">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Dashboard / {config.title}</span>
                <h1 className="text-7xl font-black tracking-tighter leading-none">{config.title}</h1>
              </div>
              <div className="text-right">
                 <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Analysis</div>
                 <div className="text-2xl font-black" style={{ color: config.accent }}>{fileName || "SESSION_RESUME"}</div>
              </div>
            </header>

            <AtsCheckerSection keyPoints={result.keyPoints} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <MetricCard title="Match Score" value={`${result.keyPoints?.ats_score || 0}%`} subtitle="Optimized" icon={Activity} color={config.accent} />
               <MetricCard title="Roles Found" value={result.totalFound || 0} subtitle="Live Posts" icon={Target} color={config.accent} />
               <div className="p-8 rounded-2xl bg-black text-white">
                 <div className="flex items-center justify-between mb-8">
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Skill Matrix</span>
                   <Brain size={14} className="text-gray-500" />
                 </div>
                 <TechnicalSkillChart skills={result.keyPoints?.skills || []} missing={result.matchedJobs?.[0]?.missingSkills || []} accent={config.accent} />
               </div>
            </div>

            <section id="opportunities">
              <div className="flex items-center justify-between mb-8 border-b pb-4">
                 <h2 className="text-4xl font-black tracking-tighter">Opportunities</h2>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Top Recommendations</span>
              </div>
              {result.matchedJobs?.map((job, i) => (
                <JobCard key={i} job={job} onPrepare={handlePrepare} onTailor={handleTailor} accent={config.accent} />
              ))}
            </section>

            <PrepareModal 
              isOpen={prepModalOpen} onClose={() => setPrepModalOpen(false)} 
              guide={prepGuide} loading={prepLoading} error={prepError}
              jobTitle={currentJob?.title} company={currentJob?.company}
            />
            
            <TailorModal 
              isOpen={tailorModalOpen} onClose={() => setTailorModalOpen(false)}
              job={currentJob} keyPoints={result.keyPoints} accent={config.accent}
            />
          </motion.div>
        )}

        {stage === "error" && (
           <div className="flex flex-col items-center justify-center py-40">
             <h2 className="text-3xl font-black text-rose-500">Analysis Failed</h2>
             <p className="text-gray-500 font-bold mb-8">We couldn't parse your resume. Please try a different format.</p>
             <button onClick={() => setStage("upload")} className="px-8 py-4 rounded-2xl bg-black text-white font-black uppercase text-xs">Try Again</button>
           </div>
        )}
      </AnimatePresence>
    </div>
  );
}
