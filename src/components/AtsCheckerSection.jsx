import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, FileText } from "lucide-react";

export default function AtsCheckerSection({ keyPoints }) {
  if (!keyPoints) return null;

  const { isAtsFriendly, atsTips } = keyPoints;

  // Since older resumes might not have this generated yet, default it if undefined
  if (isAtsFriendly === undefined || isAtsFriendly === null) return null;

  // Ensure it's a strict boolean
  const isFriendly = isAtsFriendly === true || isAtsFriendly === "true";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-6 mb-8 border ${isFriendly ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isFriendly ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"}`}>
          {isFriendly ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
        </div>
        <div className="flex-1">
          <h3 className={`text-lg font-black mb-1 ${isFriendly ? "text-emerald-900" : "text-rose-900"}`}>
            {isFriendly ? "Resume is ATS Optimized" : "Resume ATS Formatting Issues Detected"}
          </h3>
          <p className={`text-sm mb-4 font-medium ${isFriendly ? "text-emerald-800/80" : "text-rose-800/80"}`}>
            {isFriendly 
              ? "Your resume's structure and formatting are easily readable by standard Applicant Tracking Systems."
              : "Your resume contains complex formatting or unreadable structures that might block automated parsing."}
          </p>

          {!isFriendly && atsTips?.length > 0 && (
            <div className="bg-white/60 rounded-xl p-4">
               <h4 className="text-xs font-black text-rose-900 uppercase tracking-widest mb-3">Optimization Tips:</h4>
               <ul className="space-y-2 m-0 pl-0 list-none">
                 {atsTips.map((tip, idx) => (
                   <li key={idx} className="flex gap-2 text-sm text-rose-900/80 font-medium">
                     <span className="text-rose-500 font-bold">•</span>
                     {tip}
                   </li>
                 ))}
               </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
