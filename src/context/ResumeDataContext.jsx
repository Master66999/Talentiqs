import { createContext, useContext, useState, useEffect } from "react";

const ResumeDataContext = createContext(null);

const emptyProfile = {
  personal: {
    name: "Alex Jonathan",
    email: "alex.jonathan@enterprise.com",
    phone: "+1 (555) 000-0000",
    location: "Global Resident",
    jobType: "Full-Time",
    hobbies: ["Photography", "Open Source", "Traveling"],
    role: "Professional Candidate",
  },
  avatarUrl: "",
  education: [
    { type: "College", institution: "Global University", degree: "Bachelor of Technology", year: "2023", gpa: "3.8/4.0" },
    { type: "School", institution: "International School", degree: "High School Diploma", year: "2019", gpa: "4.0/4.0" },
  ],
  experience: [
    { company: "Tech Corp", role: "Junior Developer", duration: "2023 - Present", description: "Working on enterprise scale applications." }
  ],
  internships: [],
  skills: [],
  exams: [],
  certifications: [],
  projects: [],
  languages: [],
  social: { 
    linkedin: "", 
    github: "", 
    portfolio: "",
    leetcode: "",
    hackerrank: "",
    codeforces: ""
  }
};

const emptyGoals = {
  today: "",
  weekly: "",
  monthly: "",
};

export function ResumeDataProvider({ children }) {
  const [profileData, setProfileData] = useState(emptyProfile);
  const [goals, setGoals] = useState(emptyGoals);
  const [itData, setItData] = useState(null);
  const [nonItData, setNonItData] = useState(null);
  const [compData, setCompData] = useState(null);
  const [isGeneratingGoals, setIsGeneratingGoals] = useState(false);
  const [isReconstructing, setIsReconstructing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Load from DB on init
  useEffect(() => {
    const email = profileData.personal.email;
    fetchProfile(email);
    fetchGoals(email);
  }, []);

  const fetchProfile = async (email) => {
    try {
      const res = await fetch(`${API_URL}/api/profile/${email}`);
      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
      }
    } catch (e) {
      console.error("Failed to fetch profile", e);
    }
  };

  const saveProfileToDB = async (updatedProfile) => {
    try {
      await fetch(`${API_URL}/api/profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: updatedProfile.personal.email, ...updatedProfile }),
      });
    } catch (e) {
      console.error("Failed to save profile", e);
    }
  };

  const fetchGoals = async (email) => {
    try {
      const res = await fetch(`${API_URL}/api/goals/${email}`);
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (e) {
      console.error("Failed to fetch goals", e);
    }
  };

  const saveGoalsToDB = async (updatedGoals) => {
    try {
      await fetch(`${API_URL}/api/goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profileData.personal.email, ...updatedGoals }),
      });
    } catch (e) {
      console.error("Failed to save goals", e);
    }
  };

  const uploadAvatar = async (file) => {
    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("email", profileData.personal.email);

    try {
      const res = await fetch(`${API_URL}/api/upload-avatar`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { avatarUrl } = await res.json();
        setProfileData(prev => ({ ...prev, avatarUrl }));
        return avatarUrl;
      }
    } catch (e) {
      console.error("Avatar upload failed", e);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const generateAiGoals = async () => {
    console.log("🤖 Triggering AI Goal Generation with profileData:", profileData);
    setIsGeneratingGoals(true);
    try {
      const res = await fetch(`${API_URL}/api/generate-goals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileData }),
      });
      if (res.ok) {
        const newGoals = await res.json();
        console.log("✅ AI Goals Generated:", newGoals);
        setGoals(newGoals);
        saveGoalsToDB(newGoals);
      } else {
        const err = await res.json();
        console.error("❌ Backend Error Generating Goals:", err);
      }
    } catch (e) {
      console.error("❌ Failed to generate AI goals", e);
    } finally {
      setIsGeneratingGoals(false);
    }
  };

  const reconstructProfileWithAi = async (targetPath) => {
    setIsReconstructing(true);
    try {
      const res = await fetch(`${API_URL}/api/reconstruct-resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resumeText: JSON.stringify(profileData), 
          targetPath: targetPath || profileData.personal.role 
        }),
      });
      if (res.ok) {
        const reconstructed = await res.json();
        const updated = {
          ...profileData,
          personal: {
            ...profileData.personal,
            role: reconstructed.target_title || profileData.personal.role,
          },
          skills: reconstructed.core_competencies || profileData.skills,
          experience: reconstructed.experience_bullets?.map(bullet => ({
             company: "AI Enhanced Experience",
             role: profileData.personal.role,
             duration: "Strategic Update",
             description: bullet
          })) || profileData.experience
        };
        setProfileData(updated);
        saveProfileToDB(updated);
      }
    } catch (e) {
      console.error("Failed to reconstruct profile", e);
    } finally {
      setIsReconstructing(false);
    }
  };

  const updateProfileFromResume = (data) => {
    if (!data || !data.keyPoints) return;
    const kp = data.keyPoints;
    
    const newProfile = {
      ...profileData,
      personal: {
        ...profileData.personal,
        name: kp.name || profileData.personal.name,
        email: kp.email || profileData.personal.email,
        phone: kp.phone || profileData.personal.phone,
        location: kp.location || profileData.personal.location,
        role: kp.role || profileData.personal.role || (kp.experience?.[0]?.role),
      },
      skills: kp.skills || profileData.skills,
      experience: kp.experience || profileData.experience,
      education: kp.education || profileData.education,
      projects: kp.projects || profileData.projects,
    };
    
    setProfileData(newProfile);
    saveProfileToDB(newProfile);
  };

  const updateGoals = (newGoals) => {
    const updated = { ...goals, ...newGoals };
    setGoals(updated);
    saveGoalsToDB(updated);
  };

  const updateManualProfile = (updatedProfile) => {
    setProfileData(updatedProfile);
    saveProfileToDB(updatedProfile);
  };

  return (
    <ResumeDataContext.Provider value={{
      profileData, setProfileData,
      updateProfileFromResume,
      updateManualProfile,
      goals, updateGoals,
      generateAiGoals, isGeneratingGoals,
      reconstructProfileWithAi, isReconstructing,
      uploadAvatar, isUploadingAvatar,
      itData, setItData,
      nonItData, setNonItData,
      compData, setCompData,
    }}>
      {children}
    </ResumeDataContext.Provider>
  );
}

export function useResumeData() {
  const context = useContext(ResumeDataContext);
  if (!context) {
    throw new Error("useResumeData must be used within a ResumeDataProvider");
  }
  return context;
}
