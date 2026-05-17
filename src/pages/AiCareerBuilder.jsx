import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Briefcase, Award, Loader2, Download, Search, Settings, CheckCircle, FileText, Upload } from "lucide-react";

// --- Palette (aligned with dashboard) ---
const P = {
  bg:         "#0A0F1E",
  panel:      "#111827",
  panelAlt:   "#1A2236",
  gold:       "#F59E0B",
  goldLight:  "#FCD34D",
  goldBg:     "rgba(245,158,11,0.08)",
  goldBorder: "rgba(245,158,11,0.25)",
  emerald:    "#10B981",
  text:       "#F1F5F9",
  textSub:    "#94A3B8",
  textMuted:  "#64748B",
  border:     "rgba(255,255,255,0.06)",
};

export default function AiCareerBuilder() {
  // AI Career Scanner State
  const [stage, setStage] = useState("upload"); // upload | analyzing | results | reconstructing | reconstructed
  const [file, setFile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [rawText, setRawText] = useState("");
  const [targetRoleMode, setTargetRoleMode] = useState("auto"); // auto | custom
  
  // Reconstruction State
  const [reconstructedResume, setReconstructedResume] = useState(null);
  const [selectedPath, setSelectedPath] = useState("");

  const fileRef = useRef(null);

  const handleFileUpload = async (uploadedFile) => {
    if (!uploadedFile) return;
    setFile(uploadedFile);
    setStage("analyzing");

    try {
      const formData = new FormData();
      formData.append("resume", uploadedFile);
      
      if (targetRoleMode === "auto") {
        const res = await fetch("http://localhost:5000/api/career-recommendations", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setRecommendations(data);
        setRawText(data.rawResumeText);
        setStage("results");
      } else {
        // Direct Tailoring
        const res = await fetch("http://127.0.0.1:5000/api/analyze-resume", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        
        setRawText(data.rawResumeText);
        // We already have the custom target path in targetRoleMode
        setSelectedPath(targetRoleMode);
        setStage("reconstructing");
        
        const reconstructRes = await fetch("http://127.0.0.1:5000/api/reconstruct-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resumeText: data.rawResumeText, targetPath: targetRoleMode }),
        });
        const reconstructData = await reconstructRes.json();
        if (!reconstructRes.ok) throw new Error(reconstructData.error);
        
        setReconstructedResume(reconstructData);
        setStage("reconstructed");
      }

    } catch (err) {
      console.error(err);
      setStage("upload");
      alert("Failed to process resume.");
    }
  };

  const reconstructResume = async (pathName) => {
    setSelectedPath(pathName);
    setStage("reconstructing");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/reconstruct-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: rawText, targetPath: pathName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setReconstructedResume(data);
      setStage("reconstructed");
    } catch (err) {
      console.error(err);
      setStage("results");
      alert("Failed to reconstruct resume.");
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('reconstructed-resume').innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = `<div style="padding:40px; font-family:sans-serif; background:white;">${printContent}</div>`;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="min-h-screen pt-20 px-8 pb-10 flex flex-col items-center" style={{ background: P.bg, color: P.text }}>
      <div className="w-full max-w-5xl">
        
        {/* Header Profile Info */}
        <div className="flex items-center gap-6 mb-10 p-8 rounded-3xl border" style={{ background: P.panel, borderColor: P.border }}>
          <div className="w-24 h-24 rounded-full flex items-center justify-center border-2" style={{ background: P.goldBg, borderColor: P.gold, color: P.gold }}>
            <Brain className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">AI Career Path Builder</h1>
            <p className="text-sm" style={{ color: P.textSub }}>Tailor your resume instantly towards standard professional roles.</p>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              
              {stage === "upload" && (
                 <div className="flex flex-col gap-6">
                   <div className="flex flex-col md:flex-row items-start gap-8">
                     
                     {/* Role Selection */}
                     <div className="w-full md:w-1/3 p-6 rounded-3xl border" style={{ background: P.panel, borderColor: P.border }}>
                       <h3 className="text-lg font-bold mb-2">1. Select Target Role</h3>
                       <p className="text-sm text-gray-400 mb-4">Choose your desired field to strictly tailor your resume, or select Auto-Detect for career recommendations.</p>
                       
                       <select 
                         value={targetRoleMode} 
                         onChange={e => setTargetRoleMode(e.target.value)}
                         className="w-full h-12 px-4 rounded-xl outline-none cursor-pointer text-sm font-medium border"
                         style={{ background: P.bg, borderColor: P.goldBorder, color: P.text }}>
                         <option value="auto">✨ Auto-Detect Best Path</option>
                         <optgroup label="Available IT Sectors">
                           <option value="Data Scientist">Data Scientist</option>
                           <option value="Backend Developer">Backend Developer</option>
                           <option value="Frontend Developer">Frontend Developer</option>
                           <option value="Full Stack Developer">Full Stack Developer</option>
                           <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                           <option value="DevOps Engineer">DevOps Engineer</option>
                           <option value="Cloud Architect">Cloud Architect</option>
                           <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                           <option value="UX/UI Designer">UX/UI Designer</option>
                           <option value="Product Manager">Product Manager</option>
                           <option value="Systems Analyst">Systems Analyst</option>
                           <option value="Network Engineer">Network Engineer</option>
                         </optgroup>
                         <optgroup label="Other Sectors">
                           <option value="Finance Analyst">Finance Analyst</option>
                           <option value="Marketing Specialist">Marketing Specialist</option>
                           <option value="HR Manager">HR Manager</option>
                         </optgroup>
                       </select>
                     </div>

                     {/* Upload Area */}
                     <div className="w-full md:w-2/3 flex flex-col items-center justify-center p-14 rounded-3xl border border-dashed cursor-pointer hover:bg-[#1A2236] transition-colors"
                          style={{ borderColor: P.goldBorder, background: P.panel }}
                          onClick={() => fileRef.current.click()}>
                        <input ref={fileRef} type="file" accept=".pdf,.docx,.jpg,.png" className="hidden" onChange={e => handleFileUpload(e.target.files[0])} />
                        <Brain className="w-12 h-12 mb-4" style={{ color: P.gold }} />
                        <h2 className="text-xl font-bold mb-2">
                          {targetRoleMode === "auto" ? "Upload Resume to Discover Path" : `Convert Resume to ${targetRoleMode}`}
                        </h2>
                        <p className="text-sm max-w-md text-center" style={{ color: P.textSub }}>
                          {targetRoleMode === "auto" 
                             ? "The AI will scan your current experience and recommend official certificates, courses, and exams."
                             : "The AI will strictly rewrite your summary and experience to match the selected role keywords."
                          }
                        </p>
                     </div>

                   </div>
                 </div>
              )}

              {stage === "analyzing" && (
                <div className="flex flex-col items-center justify-center p-20">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: P.gold }} />
                  <p className="text-lg font-medium">Analyzing career trajectory...</p>
                  <p className="text-sm mt-2" style={{ color: P.textSub }}>Mapping to global professional standards</p>
                </div>
              )}

              {stage === "results" && recommendations && (
                <div className="grid lg:grid-cols-3 gap-6">
                   {/* Left Column: AI Overview */}
                   <div className="lg:col-span-1 p-6 rounded-3xl border" style={{ background: P.panel, borderColor: P.border }}>
                     <h3 className="text-sm text-gray-400 font-semibold mb-1 uppercase tracking-wider">AI Detected Profile</h3>
                     <h2 className="text-2xl font-bold mb-6 text-amber-500">{recommendations.determined_field}</h2>
                     
                     <div className="flex flex-col gap-2 mb-8">
                       <div className="inline-block px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold text-center">
                         Level: {recommendations.determined_level}
                       </div>
                       {recommendations.salary_expectations && (
                         <div className="inline-block px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold text-center">
                           Expected Salary: {recommendations.salary_expectations}
                         </div>
                       )}
                     </div>

                     <p className="text-sm leading-relaxed text-gray-400 mb-6">
                       Based on your background, we have mapped out exact professional certificates and exams that will instantly elevate your profile in this field. 
                     </p>
                     
                     <button onClick={() => setStage("upload")} className="text-xs text-amber-500 underline">Upload a different resume</button>
                   </div>

                   {/* Right Column: Interactive Lists */}
                   <div className="lg:col-span-2 space-y-6">
                     
                     {/* Certificates */}
                     <div className="p-6 rounded-3xl border" style={{ background: P.panelAlt, borderColor: P.border }}>
                        <div className="flex items-center gap-2 mb-4">
                          <Award className="w-5 h-5 text-amber-400" />
                          <h3 className="text-lg font-bold">Recommended Certificates</h3>
                        </div>
                        <div className="space-y-3">
                          {recommendations.certificates?.map((cert, i) => (
                            <div key={i} className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#111827] border border-gray-800">
                              <span className="text-sm font-semibold">{cert}</span>
                              <div className="flex items-center gap-2">
                                <a href={`https://www.google.com/search?q=${encodeURIComponent(cert + ' certification official')}`} target="_blank" rel="noopener noreferrer"
                                   className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition flex items-center gap-1">
                                  <Search className="w-3 h-3" /> Search
                                </a>
                                <button onClick={() => reconstructResume(cert)}
                                   className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-black transition">
                                  Reconstruct Resume for this
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                     </div>

                     {/* Courses & Exams (Visual standard links) */}
                     <div className="grid sm:grid-cols-2 gap-6">
                        {/* Courses */}
                        <div className="p-5 rounded-3xl border bg-[#1A2236] border-gray-800">
                          <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-emerald-400"/> Courses</h4>
                          <ul className="space-y-2">
                            {recommendations.courses?.map((c,i) => (
                               <li key={i}>
                                 <a href={`https://www.udemy.com/courses/search/?q=${encodeURIComponent(c)}`} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-300 hover:text-emerald-400 flex items-center gap-1 truncate"><CheckCircle className="w-3 h-3 text-emerald-500"/> {c}</a>
                               </li>
                            ))}
                          </ul>
                        </div>
                        {/* Exams */}
                        <div className="p-5 rounded-3xl border bg-[#1A2236] border-gray-800">
                          <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-purple-400"/> Relevant Exams</h4>
                          <ul className="space-y-2">
                            {recommendations.exams?.map((e,i) => (
                               <li key={i} className="text-xs text-gray-300 flex items-center gap-1 truncate"><CheckCircle className="w-3 h-3 text-purple-500"/> {e}</li>
                            ))}
                          </ul>
                        </div>
                        {/* Interview Prep */}
                        <div className="sm:col-span-2 p-5 rounded-3xl border bg-[#1A2236] border-gray-800">
                          <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-rose-400"/> Technical Interview Prep</h4>
                          <ul className="space-y-3">
                            {recommendations.interview_questions?.map((q,i) => (
                               <li key={i} className="text-xs text-gray-300 border-l-2 pl-3 border-rose-500/50 leading-relaxed">{q}</li>
                            ))}
                          </ul>
                        </div>
                     </div>

                   </div>
                </div>
              )}

              {stage === "reconstructing" && (
                <div className="flex flex-col items-center justify-center p-20">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-amber-500 flex items-center justify-center animate-spin mb-4">
                    <Settings className="w-6 h-6 text-amber-500" />
                  </div>
                  <p className="text-lg font-medium text-amber-500">Reconstructing Blueprint...</p>
                  <p className="text-sm mt-2 text-center" style={{ color: P.textSub }}>
                    Rewriting your summary and bullet points to explicitly target <br/><span className="text-white font-bold">{selectedPath}</span>.
                  </p>
                </div>
              )}

              {stage === "reconstructed" && reconstructedResume && (
                 <div className="p-8 rounded-3xl border" style={{ background: P.panel, borderColor: P.border }}>
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
                       <div>
                         <h2 className="text-2xl font-bold text-amber-500">Resume Reconstructed</h2>
                         <p className="text-xs text-gray-400 mt-1">Targeting: {selectedPath}</p>
                       </div>
                       <div className="flex items-center gap-3">
                         <button onClick={() => setStage("results")} className="text-sm px-4 py-2 text-gray-400 hover:text-white">Back to Suggestions</button>
                         <button onClick={handlePrint} className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-amber-500 text-black font-bold">
                           <Download className="w-4 h-4" /> Save as PDF
                         </button>
                       </div>
                    </div>

                    {/* Clean Print Area */}
                    <div id="reconstructed-resume" className="bg-white p-10 rounded-xl text-black max-w-3xl mx-auto shadow-2xl print:shadow-none print:p-0">
                       <h1 className="text-3xl font-black uppercase mb-1 text-gray-900 border-b-2 border-gray-900 pb-2">
                         {reconstructedResume.target_title} Candidate
                       </h1>
                       
                       <div className="mt-6">
                         <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Professional Summary</h3>
                         <p className="text-sm leading-relaxed text-gray-800">{reconstructedResume.professional_summary}</p>
                       </div>

                       <div className="mt-6">
                         <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Core Competencies</h3>
                         <p className="text-sm font-medium text-gray-800">{reconstructedResume.core_competencies?.join(" • ")}</p>
                       </div>

                       <div className="mt-6">
                         <h3 className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">Relevant Experience</h3>
                         <ul className="list-disc pl-5 space-y-2 mt-2">
                           {reconstructedResume.experience_bullets?.map((bullet, i) => (
                             <li key={i} className="text-sm leading-relaxed text-gray-800">{bullet}</li>
                           ))}
                         </ul>
                       </div>
                    </div>
                 </div>
              )}

            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
