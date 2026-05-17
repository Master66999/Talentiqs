import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, Upload, Mail, Phone, MapPin, 
  Link as LinkIcon, Briefcase, Camera, ShieldCheck, 
  ArrowRight, Loader2, Award, CheckCircle, FileText, Search,
  GraduationCap, BookOpen, Heart, Zap, Clock, Globe,
  Terminal, Database, Cpu, Layout, Settings, RefreshCw,
  Target, ShieldAlert, BarChart3, PieChart, Layers, Edit3, Save, X, Calendar,
  Plus, Trash2, Github, Linkedin, ExternalLink, MessageSquare, Globe as GlobeIcon, Sparkles, Wand2, Code, Trophy, Terminal as TerminalIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useResumeData } from "../context/ResumeDataContext";

// --- Technical Luxury Design Tokens ---
const T = {
  cream: "#FBF9F4",
  white: "#FFFFFF",
  obsidian: "#09090B",
  obsidianCard: "#111111",
  gold: "#B07D2E",
  goldLight: "#D4A24A",
  goldGlow: "rgba(176,125,46,0.15)",
  goldBorder: "rgba(176,125,46,0.30)",
  goldMuted: "rgba(176,125,46,0.07)",
  emerald: "#10B981",
  emeraldGlow: "rgba(16,185,129,0.12)",
  rose: "#F43F5E",
  textDark: "#0A0A0A",
  textMid: "#444444",
  textMuted: "#777777",
  textInverse: "#FAFAFA",
  textInvSub: "#A1A1AA",
  border: "#E2DDD2",
  borderDark: "rgba(255,255,255,0.1)",
  sans: "'Plus Jakarta Sans', sans-serif",
  mono: "'IBM Plex Mono', monospace",
  outfit: "'Outfit', sans-serif",
};

const DOT_BG = {
  backgroundColor: T.cream,
  backgroundImage: "radial-gradient(circle, #D4CDC1 1px, transparent 1px)",
  backgroundSize: "22px 22px",
};

// --- Sub-components ---

function ProfileSection({ title, icon: Icon, children, dark = false, action, glass = false }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-7 rounded-[32px] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 
        ${dark ? 'bg-black text-white border-white/10 shadow-2xl' : 
          glass ? 'bg-white/40 backdrop-blur-xl border-white/50 shadow-sm' : 
          'bg-white text-black border-gray-200 shadow-sm'}`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-2xl ${dark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-800'}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${dark ? 'text-white/40' : 'text-gray-400'}`}>{title}</h3>
            <div className={`h-1 w-8 rounded-full mt-1 ${dark ? 'bg-amber-500' : 'bg-black'}`} />
          </div>
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

function DataField({ label, value, icon: Icon, delay = 0, isEditing, onChange, name, placeholder, isLink = false }) {
  const displayValue = value || "";
  const href = displayValue.startsWith('http') ? displayValue : `https://${displayValue}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}
      className="flex flex-col gap-2 p-4 rounded-2xl hover:bg-white/60 transition-all border border-transparent hover:border-gray-100 group"
    >
      <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.textMuted, fontWeight: 800, letterSpacing: "0.1em" }}>{label.toUpperCase()}</span>
      <div className="flex items-center gap-3">
        {Icon && <Icon size={16} className="text-gray-400 flex-shrink-0 group-hover:text-amber-500 transition-colors" />}
        {isEditing ? (
          <input 
            type="text"
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-white/80 border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:border-amber-400 transition-all shadow-inner"
          />
        ) : isLink && value ? (
          <a 
            href={href} 
            target="_blank" 
            rel="noreferrer"
            className="text-sm font-extrabold text-amber-600 truncate hover:underline flex items-center gap-2"
          >
            {value}
            <ExternalLink size={12} />
          </a>
        ) : (
          <span className="text-sm font-extrabold text-gray-900 truncate" title={value}>{value || "NOT SET"}</span>
        )}
      </div>
    </motion.div>
  );
}

function EditableList({ title, items, onAdd, onRemove, onChange, fields, icon: Icon }) {
  return (
    <div className="space-y-5">
      {items.map((item, idx) => (
        <div key={idx} className="relative p-6 rounded-[24px] border border-gray-100 bg-white/50 group shadow-sm hover:shadow-md transition-all">
          <button 
            onClick={() => onRemove(idx)}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border-none cursor-pointer shadow-xl z-20"
          >
            <Trash2 size={14} />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => (
              <div key={field.key} className="flex flex-col gap-1.5">
                <span style={{ fontFamily: T.mono, fontSize: "8px", color: T.textMuted, fontWeight: 800, letterSpacing: "0.05em" }}>{field.label.toUpperCase()}</span>
                {field.type === 'textarea' ? (
                   <textarea 
                    value={item[field.key] || ""}
                    onChange={(e) => onChange(idx, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="bg-white border border-gray-100 rounded-xl px-4 py-3 text-xs font-bold focus:border-amber-400 outline-none min-h-[80px] shadow-inner"
                   />
                ) : (
                  <input 
                    value={item[field.key] || ""}
                    onChange={(e) => onChange(idx, field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="bg-white border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-amber-400 outline-none shadow-inner"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button 
        onClick={onAdd}
        className="w-full py-5 rounded-[24px] border-2 border-dashed border-gray-200 text-gray-400 hover:border-amber-400 hover:text-amber-500 transition-all flex items-center justify-center gap-3 font-black text-[10px] tracking-widest cursor-pointer bg-transparent"
      >
        <Plus size={16} /> ADD {title.toUpperCase()}
      </button>
    </div>
  );
}

function GoalInput({ label, value, onChange, icon: Icon, placeholder }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-amber-500" />
        <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textMuted, fontWeight: 800, letterSpacing: "0.1em" }}>{label.toUpperCase()}</span>
      </div>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold text-white focus:outline-none focus:border-amber-400 focus:bg-white/10 transition-all min-h-[90px] resize-none shadow-inner"
      />
    </div>
  );
}

// --- Main Component ---

export default function UserProfile() {
  const navigate = useNavigate();
  const { profileData, updateManualProfile, goals, updateGoals, generateAiGoals, isGeneratingGoals, reconstructProfileWithAi, isReconstructing, uploadAvatar, isUploadingAvatar } = useResumeData();
  const [isEditing, setIsEditing] = useState(false);
  const avatarInputRef = useRef(null);
  const [tempProfile, setTempProfile] = useState(profileData);
  const [localGoals, setLocalGoals] = useState(goals);

  useEffect(() => {
    setTempProfile({
      ...profileData,
      social: profileData.social || { linkedin: "", github: "", portfolio: "", leetcode: "", hackerrank: "", codeforces: "" },
      languages: profileData.languages || [],
      projects: profileData.projects || []
    });
  }, [profileData]);

  useEffect(() => {
    setLocalGoals(goals);
  }, [goals]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({
      ...prev,
      personal: { ...prev.personal, [name]: value }
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({
      ...prev,
      social: { ...prev.social, [name]: value }
    }));
  };

  const handleSaveProfile = () => {
    updateManualProfile(tempProfile);
    setIsEditing(false);
  };

  const handleGoalChange = (type, value) => {
    setLocalGoals(prev => ({ ...prev, [type]: value }));
  };

  const handleSaveGoals = () => {
    updateGoals(localGoals);
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const updateList = (key, idx, field, value) => {
    setTempProfile(prev => {
      const newList = [...(prev[key] || [])];
      newList[idx] = { ...newList[idx], [field]: value };
      return { ...prev, [key]: newList };
    });
  };

  const addListItem = (key, template) => {
    setTempProfile(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), template]
    }));
  };

  const removeListItem = (key, idx) => {
    setTempProfile(prev => ({
      ...prev,
      [key]: (prev[key] || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSkillChange = (idx, value) => {
    setTempProfile(prev => {
      const newSkills = [...prev.skills];
      newSkills[idx] = value;
      return { ...prev, skills: newSkills };
    });
  };

  const addSkill = () => setTempProfile(prev => ({ ...prev, skills: [...prev.skills, "NEW SKILL"] }));
  const removeSkill = (idx) => setTempProfile(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));

  const personal = tempProfile.personal || {};
  const social = tempProfile.social || {};
  const education = tempProfile.education || [];
  const experience = tempProfile.experience || [];
  const internships = tempProfile.internships || [];
  const skills = tempProfile.skills || [];
  const projects = tempProfile.projects || [];
  const languages = tempProfile.languages || [];
  const exams = tempProfile.exams || [];

  return (
    <div className="min-h-screen w-full p-10 overflow-y-auto" style={DOT_BG}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Outfit:wght@200;400;800;900&display=swap');
      `}</style>

      <div className="max-w-[1400px] mx-auto">
        {/* Futuristic Header HUD */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[40px] p-12 border border-gray-200 shadow-2xl mb-10 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-30" />
          
          <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
            <div className="relative">
              <input 
                type="file" 
                ref={avatarInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <div 
                onClick={handleAvatarClick}
                className="w-40 h-40 rounded-[36px] bg-black flex items-center justify-center border-8 border-white shadow-[0_32px_64px_rgba(0,0,0,0.15)] overflow-hidden relative group/avatar cursor-pointer"
              >
                {isUploadingAvatar ? (
                  <Loader2 size={48} className="text-white animate-spin" />
                ) : profileData.avatarUrl ? (
                  <img src={profileData.avatarUrl} alt="Profile" className="w-full h-full object-cover transition-all group-hover/avatar:scale-110" />
                ) : (
                  <UserIcon size={64} className="text-white transition-all group-hover/avatar:scale-110" />
                )}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera size={28} className="text-white" />
                </div>
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-3 -right-3 bg-emerald-500 w-10 h-10 rounded-[14px] border-4 border-white flex items-center justify-center shadow-lg"
              >
                <ShieldCheck size={20} className="text-white" />
              </motion.div>
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/50 border border-amber-200/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.gold, fontWeight: 900, letterSpacing: "0.15em" }}>SYSTEM_AUTH_OK</span>
                </div>
                <div className="h-[1px] w-12 bg-gray-200" />
                <span style={{ fontFamily: T.mono, fontSize: "9px", color: T.textMuted, fontWeight: 800 }}>ID_RX_992</span>
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <input name="name" value={personal.name} onChange={handlePersonalChange} className="bg-transparent border-b-2 border-amber-400 text-5xl font-black focus:outline-none w-full" style={{ fontFamily: T.outfit }} placeholder="Enter Name" />
                  <input name="role" value={personal.role} onChange={handlePersonalChange} className="bg-transparent border-b border-gray-200 text-xl font-bold text-gray-500 focus:outline-none w-full" placeholder="Target Professional Role" />
                </div>
              ) : (
                <>
                  <h1 style={{ fontFamily: T.outfit, fontWeight: 900, fontSize: "64px", color: T.textDark, letterSpacing: "-3px", lineHeight: 0.9 }}>
                    {personal.name || "Alex Jonathan"}
                  </h1>
                  <p style={{ fontFamily: T.sans, fontSize: "22px", color: T.textMid, marginTop: "12px" }} className="font-extrabold tracking-tight">
                    {personal.role || "Global Talent Professional"}
                  </p>
                </>
              )}
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 mt-10">
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-amber-50 transition-colors">
                    <Mail size={16} className="text-gray-400 group-hover:text-amber-600" />
                  </div>
                  <span className="text-sm font-black text-gray-800">{personal.email}</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-2 rounded-xl bg-gray-50 group-hover:bg-emerald-50 transition-colors">
                    <MapPin size={16} className="text-gray-400 group-hover:text-emerald-600" />
                  </div>
                  <span className="text-sm font-black text-gray-800">{personal.location || "Remote Workspace"}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-auto">
              <div className="flex gap-3">
                {isEditing ? (
                  <>
                    <button onClick={handleSaveProfile} className="px-8 py-5 rounded-[20px] bg-black text-white font-black text-xs flex items-center gap-3 border-none cursor-pointer flex-1 shadow-2xl hover:bg-amber-900 transition-all">
                      <Save size={18} /> SAVE CHANGES
                    </button>
                    <button onClick={() => { setIsEditing(false); setTempProfile(profileData); }} className="px-6 py-5 rounded-[20px] bg-gray-100 text-gray-900 font-black text-xs border-none cursor-pointer">
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => reconstructProfileWithAi()}
                      disabled={isReconstructing}
                      className="px-8 py-5 rounded-[20px] bg-amber-500 text-white font-black text-xs shadow-[0_16px_32px_rgba(176,125,46,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border-none cursor-pointer flex-1"
                    >
                      {isReconstructing ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={18} />}
                      AI RECONSTRUCT
                    </button>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-8 py-5 rounded-[20px] bg-black text-white font-black text-xs shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 border-none cursor-pointer"
                    >
                      <Edit3 size={18} />
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />)}
                 </div>
                 <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Linked by TalentIQS</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Side: Stats, Identity, Goals, Arsenal */}
          <div className="lg:col-span-4 space-y-8">
            
            <ProfileSection title="Digital Authority" icon={ShieldCheck} dark>
               <div className="grid grid-cols-1 gap-2">
                 <DataField isEditing={isEditing} onChange={handleSocialChange} name="linkedin" label="LinkedIn" value={social.linkedin} icon={Linkedin} isLink />
                 <DataField isEditing={isEditing} onChange={handleSocialChange} name="github" label="GitHub" value={social.github} icon={Github} isLink />
                 <DataField isEditing={isEditing} onChange={handleSocialChange} name="leetcode" label="LeetCode" value={social.leetcode} icon={Code} placeholder="leetcode.com/username" isLink />
                 <DataField isEditing={isEditing} onChange={handleSocialChange} name="hackerrank" label="HackerRank" value={social.hackerrank} icon={Trophy} placeholder="hackerrank.com/username" isLink />
                 <DataField isEditing={isEditing} onChange={handleSocialChange} name="portfolio" label="Website" value={social.portfolio} icon={GlobeIcon} isLink />
               </div>
            </ProfileSection>

            <ProfileSection title="Performance Matrix" icon={Target} dark action={
              <div className="flex gap-2">
                <button 
                  onClick={generateAiGoals} 
                  disabled={isGeneratingGoals}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-amber-500 transition-all border-none cursor-pointer flex items-center gap-2 group"
                >
                  {isGeneratingGoals ? <Loader2 size={16} className="animate-spin text-white" /> : <Sparkles size={16} className="text-amber-400 group-hover:text-white" />}
                </button>
                <button onClick={handleSaveGoals} className="p-2.5 rounded-xl bg-white/10 hover:bg-emerald-500 transition-all border-none cursor-pointer">
                  <Save size={16} className="text-white" />
                </button>
              </div>
            }>
              <div className="space-y-8">
                <GoalInput 
                  label="Daily Directive" 
                  value={localGoals.today} 
                  onChange={(v) => handleGoalChange("today", v)}
                  icon={Clock}
                  placeholder="Set today's focus..."
                />
                <GoalInput 
                  label="Weekly Objective" 
                  value={localGoals.weekly} 
                  onChange={(v) => handleGoalChange("weekly", v)}
                  icon={Calendar}
                  placeholder="Set weekly milestone..."
                />
                <GoalInput 
                  label="Strategic Monthly Goal" 
                  value={localGoals.monthly} 
                  onChange={(v) => handleGoalChange("monthly", v)}
                  icon={Globe}
                  placeholder="Define your monthly vision..."
                />
              </div>
            </ProfileSection>

            <ProfileSection title="Technical Arsenal" icon={Terminal}>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((s, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs font-black text-gray-800 shadow-sm transition-all"
                  >
                    {isEditing ? (
                      <input 
                        value={s} 
                        onChange={(e) => handleSkillChange(i, e.target.value)} 
                        className="bg-transparent border-none text-gray-800 outline-none w-24 font-black uppercase"
                      />
                    ) : s}
                    {isEditing && <button onClick={() => removeSkill(i)} className="p-1 hover:text-rose-500 border-none bg-transparent cursor-pointer"><X size={12}/></button>}
                  </motion.div>
                ))}
                {isEditing && (
                  <button onClick={addSkill} className="px-4 py-2.5 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 text-xs font-black hover:border-black hover:text-black transition-all cursor-pointer bg-transparent">
                    + NEW SKILL
                  </button>
                )}
              </div>
            </ProfileSection>
          </div>

          {/* Right Side: Primary Content Timeline */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Experience & Academic Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProfileSection title="Career Timeline" icon={Briefcase} glass>
                {isEditing ? (
                  <EditableList 
                    title="Experience" 
                    items={experience} 
                    onAdd={() => addListItem('experience', { company: "", role: "", duration: "", description: "" })}
                    onRemove={(idx) => removeListItem('experience', idx)}
                    onChange={(idx, field, val) => updateList('experience', idx, field, val)}
                    fields={[
                      { key: 'company', label: 'Company', placeholder: 'Enterprise Tech' },
                      { key: 'role', label: 'Position', placeholder: 'Senior Solutions Architect' },
                      { key: 'duration', label: 'Timeline', placeholder: '2021 - Present' },
                      { key: 'description', label: 'Brief Summary', placeholder: 'Led technical implementation...', type: 'textarea' },
                    ]}
                  />
                ) : (
                  <div className="space-y-8">
                    {experience.map((exp, i) => (
                      <div key={i} className="relative pl-8 border-l-4 border-emerald-500/20 py-1 hover:border-emerald-500 transition-colors">
                        <div className="absolute -left-[10px] top-2 w-4 h-4 rounded-lg bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        <h4 className="text-base font-black text-gray-900 mb-1">{exp.role}</h4>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{exp.company}</span>
                          <span className="text-[10px] font-bold text-gray-400">{exp.duration}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-bold leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </ProfileSection>

              <ProfileSection title="Intellectual Path" icon={GraduationCap} glass>
                 {isEditing ? (
                  <EditableList 
                    title="Education" 
                    items={education} 
                    onAdd={() => addListItem('education', { institution: "", degree: "", year: "" })}
                    onRemove={(idx) => removeListItem('education', idx)}
                    onChange={(idx, field, val) => updateList('education', idx, field, val)}
                    fields={[
                      { key: 'institution', label: 'University', placeholder: 'Stanford Graduate' },
                      { key: 'degree', label: 'Field', placeholder: 'M.S. Computer Science' },
                      { key: 'year', label: 'Completion', placeholder: '2023' },
                    ]}
                  />
                ) : (
                  <div className="space-y-8">
                    {education.map((edu, i) => (
                      <div key={i} className="relative pl-8 border-l-4 border-amber-500/20 py-1 hover:border-amber-500 transition-colors">
                        <div className="absolute -left-[10px] top-2 w-4 h-4 rounded-lg bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                        <h4 className="text-base font-black text-gray-900 mb-1">{edu.institution}</h4>
                        <p className="text-xs font-black text-amber-600 uppercase mb-1">{edu.degree}</p>
                        <span className="text-[10px] font-bold text-gray-400">{edu.year}</span>
                      </div>
                    ))}
                  </div>
                )}
              </ProfileSection>
            </div>

            {/* Projects & Internships */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProfileSection title="Project Portfolio" icon={Layout}>
                 {isEditing ? (
                   <EditableList 
                    title="Project" 
                    items={projects} 
                    onAdd={() => addListItem('projects', { name: "", tech: "", desc: "", url: "", github: "" })}
                    onRemove={(idx) => removeListItem('projects', idx)}
                    onChange={(idx, field, val) => updateList('projects', idx, field, val)}
                    fields={[
                      { key: 'name', label: 'Project', placeholder: 'System X' },
                      { key: 'tech', label: 'Technologies', placeholder: 'Rust, AWS, k8s' },
                      { key: 'url', label: 'Live Demo URL', placeholder: 'https://demo.com' },
                      { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/repo' },
                      { key: 'desc', label: 'Impact', placeholder: 'Optimized query latency by 40%...', type: 'textarea' },
                    ]}
                  />
                 ) : (
                   <div className="space-y-6">
                    {projects.map((proj, i) => (
                      <div key={i} className="p-6 rounded-[24px] bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-xl transition-all group">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-black text-gray-900">{proj.name}</h4>
                          <div className="flex gap-2">
                             {proj.github && (
                               <a href={proj.github} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-gray-100 hover:bg-black hover:text-white transition-all text-gray-400">
                                 <Github size={12} />
                               </a>
                             )}
                             {proj.url && (
                               <a href={proj.url} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-gray-100 hover:bg-amber-500 hover:text-white transition-all text-gray-400">
                                 <ExternalLink size={12} />
                               </a>
                             )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                           {proj.tech?.split(',').map((t, idx) => (
                             <span key={idx} className="px-2 py-1 rounded-md bg-black text-white text-[9px] font-black uppercase tracking-tighter">{t.trim()}</span>
                           ))}
                        </div>
                        <p className="text-xs text-gray-500 font-bold leading-relaxed">{proj.desc}</p>
                      </div>
                    ))}
                   </div>
                 )}
              </ProfileSection>

              <div className="space-y-8">
                <ProfileSection title="Linguistic Depth" icon={MessageSquare} glass>
                   <div className="space-y-5">
                    {languages.map((lang, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-black" />
                          <span className="text-sm font-black text-gray-800">{isEditing ? <input value={lang.name} onChange={(e) => updateList('languages', idx, 'name', e.target.value)} className="bg-transparent border-none outline-none font-black" /> : lang.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-md uppercase">{isEditing ? <input value={lang.level} onChange={(e) => updateList('languages', idx, 'level', e.target.value)} className="bg-transparent border-none outline-none font-black text-center" /> : lang.level}</span>
                      </div>
                    ))}
                    {isEditing && (
                      <button onClick={() => addListItem('languages', { name: "English", level: "Native" })} className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 text-[10px] font-bold hover:border-amber-400 hover:text-amber-500 cursor-pointer bg-transparent">+ ADD LANGUAGE</button>
                    )}
                   </div>
                </ProfileSection>

                <ProfileSection title="Benchmark Analysis" icon={Award} dark>
                   <div className="space-y-5">
                      <div className="flex items-center justify-between mb-2">
                        <span style={{ fontFamily: T.mono, fontSize: "10px", color: T.textInvSub, fontWeight: 800 }}>PROFILE VELOCITY</span>
                        <span style={{ fontFamily: T.mono, fontSize: "14px", color: T.gold, fontWeight: 900 }}>EXTREME</span>
                      </div>
                      <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 p-[2px]">
                        <motion.div 
                          initial={{ width: 0 }} animate={{ width: "94%" }}
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full" 
                        />
                      </div>
                      <p className="text-[10px] text-white/40 font-bold leading-relaxed">
                        Data Reconstructed. Your profile is now performing at the **Top 1%** for ${personal.role} roles globally.
                      </p>
                   </div>
                </ProfileSection>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-20 text-center">
           <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-20 bg-gray-200" />
              <ShieldCheck size={20} className="text-gray-300" />
              <div className="h-[1px] w-20 bg-gray-200" />
           </div>
           <p style={{ fontFamily: T.mono, fontSize: "10px", color: T.textMuted, letterSpacing: "0.2em", fontWeight: 800 }}>
             TALENTIQS QUANTUM PROFILE ENGINE &middot; RECONSTRUCTED AT {new Date().toLocaleTimeString()}
           </p>
        </div>
      </div>
    </div>
  );
}
