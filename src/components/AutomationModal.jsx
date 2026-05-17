import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Send, Mail, Briefcase, FileText, 
  Clock, Calendar, CheckCircle2, Loader2, Upload 
} from "lucide-react";

const P = {
  bg:        "#FAF7F2",
  panel:     "#FFFFFF",
  gold:      "#B07D2E",
  goldBg:    "rgba(176,125,46,0.06)",
  text:      "#1C160E",
  textSub:   "#6B5B45",
  textMuted: "#A89178",
  border:    "rgba(176,125,46,0.18)",
  borderSub: "rgba(28,22,14,0.07)",
};

export default function AutomationModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    hrEmail: "",
    companyName: "",
    emailContent: "Dear HR Team,\n\nI am interested in applying for a position at [Company]. Attached is my resume for your review.\n\nBest regards,",
    frequencyType: "daily",
    frequencyValue: 1,
  });
  const [resume, setResume] = useState(null);
  const fileRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return alert("Please upload your resume");
    
    setLoading(true);
    try {
      const data = new FormData();
      data.append("resume", resume);
      data.append("hrEmail", formData.hrEmail);
      data.append("companyName", formData.companyName);
      data.append("emailContent", formData.emailContent);
      data.append("frequencyType", formData.frequencyType);
      data.append("frequencyValue", formData.frequencyValue);

      const res = await fetch("http://localhost:5000/api/automations", {
        method: "POST",
        body: data,
      });
      
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setStep(1);
      }, 3000);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border overflow-hidden relative"
        style={{ borderColor: P.borderSub }}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          style={{ color: P.textMuted }}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 min-h-[500px]">
          {/* Left Sidebar Info */}
          <div className="md:col-span-2 p-8 flex flex-col justify-between" style={{ background: P.goldBg }}>
            <div className="space-y-6">
               <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md bg-white" style={{ color: P.gold }}>
                 <Send className="w-6 h-6" />
               </div>
               <div>
                 <h2 className="text-xl font-bold tracking-tight" style={{ color: P.text }}>Email Automation</h2>
                 <p className="text-xs mt-2 leading-relaxed" style={{ color: P.textSub }}>
                   Configure a recurring outreach task. Our AI-backed system will ensure your resume reaches the right inbox at the perfect time.
                 </p>
               </div>
               
               <div className="space-y-4 pt-4">
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-0.5 rounded-full" style={{ background: step === 1 ? P.gold : P.textMuted }} />
                   <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: step === 1 ? P.text : P.textMuted }}>Details</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-6 h-0.5 rounded-full" style={{ background: step === 2 ? P.gold : P.textMuted }} />
                   <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: step === 2 ? P.text : P.textMuted }}>Schedule</span>
                 </div>
               </div>
            </div>

            <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: P.textMuted }}>
              Talentiqs / Engine v4.2
            </div>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3 p-10 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: P.text }}>Task Scheduled!</h3>
                  <p className="text-xs" style={{ color: P.textSub }}>The automation is now active. We'll start sending emails as per your schedule.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 ? (
                    <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: P.textMuted }}>Target HR Email</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-900/40" />
                          <input 
                            type="email" required placeholder="hr@company.com"
                            value={formData.hrEmail} onChange={e => setFormData({...formData, hrEmail: e.target.value})}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 text-sm"
                            style={{ background: "#FFFFFF", borderColor: P.borderSub }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: P.textMuted }}>Company Name</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-900/40" />
                          <input 
                            type="text" required placeholder="TechCorp Inc."
                            value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}
                            className="w-full h-11 pl-10 pr-4 rounded-xl border outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 text-sm"
                            style={{ background: "#FFFFFF", borderColor: P.borderSub }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: P.textMuted }}>Resume (PDF Only)</label>
                        <div 
                          onClick={() => fileRef.current.click()}
                          className="w-full h-14 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-gray-50 active:scale-[0.98]"
                          style={{ borderColor: P.border, background: resume ? P.goldBg : "transparent" }}
                        >
                           <Upload className="w-4 h-4" style={{ color: P.gold }} />
                           <span className="text-xs font-bold" style={{ color: resume ? P.text : P.textSub }}>
                             {resume ? resume.name : "Select Resume File"}
                           </span>
                           <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={e => setResume(e.target.files[0])} />
                        </div>
                      </div>
                      <button 
                        type="button" onClick={() => setStep(2)}
                        className="w-full h-12 rounded-xl bg-black text-white text-sm font-bold shadow-lg hover:shadow-black/10 transition-all active:scale-95"
                      >
                        Next: Configure Schedule
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: P.textMuted }}>Email Content</label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-4 w-4 h-4 text-amber-900/40" />
                          <textarea 
                            required rows="3"
                            value={formData.emailContent} onChange={e => setFormData({...formData, emailContent: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/5 text-xs font-medium leading-relaxed"
                            style={{ background: "#FFFFFF", borderColor: P.borderSub, minHeight: "100px" }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: P.textMuted }}>Mode</label>
                          <select 
                            value={formData.frequencyType} onChange={e => setFormData({...formData, frequencyType: e.target.value})}
                            className="w-full h-11 px-3 rounded-xl border outline-none text-sm font-bold"
                            style={{ background: "#FFFFFF", borderColor: P.borderSub }}
                          >
                            <option value="daily">Daily Count</option>
                            <option value="interval">Custom Interval</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2" style={{ color: P.textMuted }}>
                            {formData.frequencyType === 'daily' ? 'Times Per Day' : 'Mins Interval'}
                          </label>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-900/40" />
                            <input 
                              type="number" required min="1"
                              value={formData.frequencyValue} onChange={e => setFormData({...formData, frequencyValue: e.target.value})}
                              className="w-full h-11 pl-10 pr-4 rounded-xl border outline-none text-sm font-bold"
                              style={{ background: "#FFFFFF", borderColor: P.borderSub }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          type="button" onClick={() => setStep(1)}
                          className="h-12 px-6 rounded-xl border text-sm font-bold hover:bg-gray-50 active:scale-95 transition-all"
                          style={{ borderColor: P.borderSub, color: P.textSub }}
                        >
                          Back
                        </button>
                        <button 
                          type="submit" disabled={loading}
                          className="flex-1 h-12 rounded-xl bg-black text-white text-sm font-bold shadow-lg hover:shadow-black/10 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                            <>
                              Start Automation
                              <Calendar className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
