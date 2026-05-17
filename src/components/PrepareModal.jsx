import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2, CheckCircle2, Target, BookOpen, Clock, Award, Terminal, Code2, Star } from "lucide-react";

export default function PrepareModal({ isOpen, onClose, guide, loading, error, jobTitle, company }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100"
        >
          {/* Header */}
          <div className="p-8 bg-black text-white flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">{jobTitle}</h2>
                <p className="text-xs font-bold text-amber-500/80 uppercase tracking-widest">{company} &middot; PREP STRATEGY</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/40 border-none bg-transparent cursor-pointer">
              <X size={20} />
            </button>
          </div>

          <div className="p-8 max-h-[75vh] overflow-y-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <Loader2 size={48} className="text-amber-600 animate-spin mb-4" />
                <h3 className="text-lg font-black text-gray-900">Consulting AI Strategist...</h3>
                <p className="text-sm text-gray-500 font-bold mt-2 uppercase tracking-tighter">Mapping competitive requirements to your profile</p>
              </div>
            ) : guide ? (
              <div className="flex flex-col gap-6">
                
                {/* 1. What You Need To Prepare - Roadmap */}
                <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock size={18} className="text-black" />
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">What You Need To Prepare</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {guide.roadmap?.map((step, i) => (
                      <div key={i} className="flex flex-col gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-amber-500 transition-colors group">
                        <div className="w-8 h-8 rounded-xl bg-gray-50 text-black flex items-center justify-center font-black text-xs group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          {i + 1}
                        </div>
                        <p className="text-xs font-bold text-gray-800 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Top Stats: HackerRank & New Tech */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* HackerRank Target */}
                  <div className="md:col-span-5 p-8 rounded-3xl bg-black border border-gray-800 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <Star size={16} className="text-amber-500" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Required HackerRank Level</span>
                    </div>
                    <div className="flex items-end gap-3">
                      <p className="text-3xl font-black text-white italic">"{guide.hackerRankLevel || "Intermediate"}"</p>
                    </div>
                  </div>

                  {/* New Company Technologies */}
                  <div className="md:col-span-7 p-6 rounded-3xl bg-blue-50 border border-blue-100 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <Terminal size={16} className="text-blue-600" />
                      <span className="text-[10px] font-black text-blue-900/60 uppercase tracking-widest">New Company Technologies</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {guide.newTech?.map((tech, i) => (
                         <span key={i} className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-xs font-black text-blue-900 shadow-sm flex items-center gap-1">
                           <Sparkles size={10} className="text-blue-500"/> {tech}
                         </span>
                       ))}
                       {(!guide.newTech || guide.newTech.length === 0) && (
                         <span className="text-xs text-blue-600/60 font-bold italic">No new stack required. You are up to date.</span>
                       )}
                    </div>
                  </div>
                </div>

                {/* 3. Concepts: Familiar vs Gaps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex flex-col">
                    <div className="flex items-center gap-2 mb-5">
                      <BookOpen size={16} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-emerald-900/60 uppercase tracking-widest">Familiar Concepts Needed</span>
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      {guide.focusTopics?.map((topic, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                          <p className="text-xs font-bold text-emerald-950 leading-relaxed">{topic}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-rose-50 border border-rose-100 flex flex-col">
                    <div className="flex items-center gap-2 mb-5">
                      <Target size={16} className="text-rose-500" />
                      <span className="text-[10px] font-black text-rose-900/60 uppercase tracking-widest">Concepts to Improve (Gaps)</span>
                    </div>
                    <div className="flex flex-col gap-3 flex-1">
                      {guide.gaps?.length > 0 ? guide.gaps.map((gap, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <X size={16} className="text-rose-500 shrink-0 mt-0.5" />
                          <p className="text-xs font-bold text-rose-950 leading-relaxed">{gap}</p>
                        </div>
                      )) : (
                        <p className="text-xs font-bold text-rose-600/60 italic">No significant gaps detected.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 4. Actionables: Projects, Certs, Languages */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-6 rounded-3xl bg-white border border-gray-200">
                     <div className="flex items-center gap-2 mb-4">
                       <Award size={14} className="text-purple-500" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recommended Certs</span>
                     </div>
                     <div className="flex flex-col gap-2">
                       {guide.certificates?.length > 0 ? guide.certificates.map((cert, i) => (
                         <div key={i} className="text-[11px] font-bold text-gray-800 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{cert}</div>
                       )) : <span className="text-xs text-gray-400 italic">None required.</span>}
                     </div>
                   </div>

                   <div className="p-6 rounded-3xl bg-white border border-gray-200">
                     <div className="flex items-center gap-2 mb-4">
                       <Code2 size={14} className="text-amber-500" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Must-Have Languages</span>
                     </div>
                     <div className="flex flex-wrap gap-2">
                       {guide.languages?.length > 0 ? guide.languages.map((lang, i) => (
                         <span key={i} className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-black border border-amber-200">{lang}</span>
                       )) : <span className="text-xs text-gray-400 italic">Standard stack.</span>}
                     </div>
                   </div>

                   <div className="p-6 rounded-3xl bg-white border border-gray-200">
                     <div className="flex items-center gap-2 mb-4">
                       <Terminal size={14} className="text-black" />
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Projects to Build</span>
                     </div>
                     <div className="flex flex-col gap-2">
                       {guide.suggestedProjects?.length > 0 ? guide.suggestedProjects.map((proj, i) => (
                         <div key={i} className="text-[11px] font-bold text-gray-800 flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-black mt-1.5 shrink-0"/>{proj}</div>
                       )) : <span className="text-xs text-gray-400 italic">N/A</span>}
                     </div>
                   </div>
                </div>

              </div>
            ) : error ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-6">
                   <Target size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900">Analysis Halted</h3>
                <p className="text-sm text-gray-500 font-bold mt-2 max-w-xs mx-auto">{error}</p>
                <button 
                  onClick={onClose}
                  className="mt-8 px-6 py-2 rounded-xl border-2 border-black font-black text-xs hover:bg-black hover:text-white transition-all"
                >
                  RETRY ANALYSIS
                </button>
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-gray-400 font-bold">Something went wrong. Please try again.</p>
              </div>
            )}
          </div>

          <div className="p-8 bg-gray-50 border-t flex items-center justify-between">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">System Protocol: Active</p>
            <button 
              onClick={onClose}
              className="px-10 py-4 rounded-2xl bg-black text-white font-black text-xs border-none cursor-pointer hover:bg-amber-800 transition-all shadow-xl active:scale-95"
            >
              EXECUTE PREPARATION
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
