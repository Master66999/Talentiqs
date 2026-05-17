import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Mail, ArrowRight, Loader2, 
  CheckCircle2, AlertCircle, RefreshCw, ChevronLeft 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// --- Creamy Light Professional Palette ---
const P = {
  bg:        "#FAF7F2",          // cream background
  panel:     "#FFFFFF",          // white cards
  panelAlt:  "#FAF7F2",          // slight cream tint
  gold:      "#B07D2E",          // antique gold
  goldLight: "#D4A24A",          
  goldBg:    "rgba(176,125,46,0.06)",
  emerald:   "#6B8F71",          // sage emerald
  emeraldBg: "rgba(107,143,113,0.1)",
  rose:      "#C4705A",          // rose/terracotta
  text:      "#1C160E",          // dark warm brown
  textSub:   "#6B5B45",          // medium brown
  textMuted: "#A89178",          // soft grey-brown
  border:    "rgba(176,125,46,0.18)",
  borderSub: "rgba(28,22,14,0.07)",
};

export default function Verification() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [step, setStep] = useState("email"); // email | otp | success
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setStep("otp");
      setCooldown(60);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) return;
    
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setStep("success");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-sans" style={{ background: P.bg }}>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden border"
        style={{ borderColor: P.borderSub }}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -translate-y-12 translate-x-12 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full translate-y-12 -translate-x-12 blur-3xl" />

        <button 
          onClick={() => step === 'otp' ? setStep('email') : navigate("/dashboard/profile")}
          className="absolute top-8 left-8 p-2 rounded-full hover:bg-gray-100 transition-colors"
          style={{ color: P.textSub }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          
          {step === "email" && (
            <motion.div 
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg" 
                   style={{ background: `linear-gradient(135deg, ${P.gold} 0%, ${P.goldLight} 100%)`, color: "white" }}>
                <ShieldCheck className="w-10 h-10" />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight" style={{ color: P.text }}>Verify Your Identity</h1>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: P.textSub }}>
                  Standardize your professional standing on TalentIQS by verifying your primary email address.
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="w-full space-y-4 pt-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-amber-600" style={{ color: P.textMuted }} />
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl outline-none transition-all border shadow-sm focus:ring-4 focus:ring-amber-500/10"
                    style={{ background: "#FFFFFF", borderColor: P.borderSub, color: P.text }}
                  />
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl font-bold text-white shadow-lg shadow-amber-900/10 hover:shadow-amber-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                  style={{ background: P.text }}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      Send Verification Code
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center text-center space-y-8"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-gray-50 border border-gray-100 shadow-inner">
                <Mail className="w-8 h-8" style={{ color: P.gold }} />
              </div>

              <div>
                <h1 className="text-2xl font-black tracking-tight" style={{ color: P.text }}>Check Your Inbox</h1>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: P.textSub }}>
                  We've sent a 6-digit code to <span className="font-bold text-amber-900">{email}</span>
                </p>
              </div>

              <div className="flex gap-2 sm:gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="w-10 h-14 sm:w-12 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all focus:border-amber-600 focus:ring-4 focus:ring-amber-500/5"
                    style={{ background: "#FFFFFF", borderColor: P.borderSub, color: P.text }}
                  />
                ))}
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-rose-600 text-xs font-bold bg-rose-50 px-4 py-2 rounded-full border border-rose-100">
                  <AlertCircle className="w-3.5 h-3.5" /> {error}
                </motion.div>
              )}

              <div className="w-full space-y-4">
                <button 
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.some(d => !d)}
                  className="w-full h-14 rounded-2xl font-bold text-white shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: P.text }}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
                </button>

                <div className="flex justify-center flex-col items-center gap-2">
                   <p className="text-xs" style={{ color: P.textMuted }}>Didn't receive the code?</p>
                   <button 
                     onClick={handleSendOTP}
                     disabled={cooldown > 0 || loading}
                     className="text-xs font-bold flex items-center gap-1.5 underline-offset-4 hover:underline disabled:opacity-50"
                     style={{ color: P.gold }}
                   >
                     <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                     {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP Now"}
                   </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === "success" && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center space-y-8 py-4"
            >
              <div className="relative">
                <motion.div 
                   initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
                   className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl shadow-emerald-500/20"
                >
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl -z-10 animate-pulse" />
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-tight text-emerald-900">Verified!</h1>
                <p className="text-sm leading-relaxed" style={{ color: P.textSub }}>
                  Congratulations! Your profile is now officially verified. You've unlocked exclusive AI analytics and premium networking badges.
                </p>
              </div>

              <button 
                onClick={() => navigate("/dashboard/profile")}
                className="w-full h-14 rounded-2xl font-bold text-white shadow-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 transition-all"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
