import React from "react";
import { Target, Clock, Calendar, Globe, Save, Sparkles, Loader2 } from "lucide-react";
import { useResumeData } from "../context/ResumeDataContext";

export default function GoalSidebarSection({ collapsed }) {
  const { goals, updateGoals, generateAiGoals, isGeneratingGoals } = useResumeData();
  const [localToday, setLocalToday] = React.useState(goals.today || "");

  React.useEffect(() => {
    setLocalToday(goals.today || "");
  }, [goals.today]);

  const handleSaveToday = () => {
    updateGoals({ today: localToday });
  };

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 border-t border-gray-100">
        <Target size={18} className="text-amber-500" />
      </div>
    );
  }

  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={14} className="text-amber-600" />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Daily Focus</span>
        </div>
        <div className="flex gap-1">
          <button 
            onClick={generateAiGoals}
            disabled={isGeneratingGoals}
            title="Generate with AI"
            className="p-1.5 rounded-md hover:bg-amber-100 text-amber-600 transition-colors border-none bg-transparent cursor-pointer"
          >
            {isGeneratingGoals ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
          </button>
          <button 
            onClick={handleSaveToday}
            className="p-1.5 rounded-md hover:bg-amber-100 text-amber-600 transition-colors border-none bg-transparent cursor-pointer"
          >
            <Save size={12} />
          </button>
        </div>
      </div>
      
      <textarea 
        value={localToday}
        onChange={(e) => setLocalToday(e.target.value)}
        placeholder="Today's goal..."
        className="w-full bg-white border border-gray-200 rounded-lg p-2 text-[11px] font-bold text-gray-700 focus:border-amber-400 outline-none resize-none min-h-[60px]"
      />

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[9px] font-bold text-gray-400">WEEKLY</span>
          <span className="text-[9px] font-black text-amber-600 truncate max-w-[100px]">{goals.weekly || "AI can set this"}</span>
        </div>
        <div className="flex items-center justify-between px-1">
          <span className="text-[9px] font-bold text-gray-400">MONTHLY</span>
          <span className="text-[9px] font-black text-amber-600 truncate max-w-[100px]">{goals.monthly || "AI can set this"}</span>
        </div>
      </div>
    </div>
  );
}
