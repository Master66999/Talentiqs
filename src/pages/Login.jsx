import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowRight, Mail, Lock, Sparkles, ArrowUpRight, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
  bg:        "#FAF7F2",
  panel:     "#FFFFFF",
  panelAlt:  "#F5F0E8",
  gold:      "#B07D2E",
  goldLight: "#D4A24A",
  goldBg:    "rgba(176,125,46,0.05)",
  goldBorder:"rgba(176,125,46,0.2)",
  text:      "#1C160E",
  textSub:   "#6B5B45",
  textMuted: "#A89178",
  border:    "rgba(28,22,14,0.08)",
  shadow:    "0 16px 48px rgba(28,22,14,0.06), 0 2px 12px rgba(28,22,14,0.04)",
};

const GoogleLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  
  const formRef = useRef(null);
  const leftPanelRef = useRef(null);
  const floatingOrbRef = useRef(null);

  useEffect(() => {
    // Abstract orb floating animation
    gsap.to(floatingOrbRef.current, { y: -30, x: 20, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut" });

    // Entrance animation for form
    gsap.fromTo(formRef.current, 
      { opacity: 0, x: 20 }, 
      { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login({ email: formData.email, name: formData.name || "Luxury User" });
      setIsLoading(false);
      navigate("/category");
    }, 1200);
  };

  const GoogleLoginBtn = () => {
    const btnRef = useRef(null);
    const arrowRef = useRef(null);
    
    return (
      <button ref={btnRef} type="button" 
        className="relative w-full h-12 rounded-xl flex items-center justify-center gap-3 border outline-none overflow-hidden transition-all duration-300 group"
        style={{ background: P.panel, borderColor: P.border, boxShadow: "0 2px 8px rgba(28,22,14,0.03)" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = P.goldBorder;
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(176,125,46,0.12)";
          gsap.to(arrowRef.current, { x: 4, opacity: 1, duration: 0.3, ease: "power2.out" });
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = P.border;
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(28,22,14,0.03)";
          gsap.to(arrowRef.current, { x: 0, opacity: 0, duration: 0.3, ease: "power2.out" });
        }}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(176,125,46,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <GoogleLogo />
        <span className="text-sm font-semibold" style={{ color: P.text }}>Continue with Google</span>
        <ArrowRight ref={arrowRef} className="absolute right-5 w-4 h-4 opacity-0" style={{ color: P.gold }} />
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FAF7F2] overflow-hidden">
      
      {/* ── Left Split (Brand Story) ── */}
      <div ref={leftPanelRef} className="hidden lg:flex flex-1 relative flex-col p-12 overflow-hidden border-r"
        style={{ borderColor: P.border, background: "linear-gradient(180deg, #F3ECE1 0%, #FAF7F2 100%)" }}>
        
        {/* Decorative noise texture overlay */}
        <div className="absolute inset-0 opacity-30 mix-blend-multiply" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }} />
        
        {/* Subtle decorative orb */}
        <div ref={floatingOrbRef} className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full blur-[100px] pointer-events-none"
             style={{ background: "radial-gradient(circle, rgba(176,125,46,0.08) 0%, transparent 60%)" }} />

        {/* Brand header */}
        <div className="relative z-10 w-fit">
          <Link to="/" className="flex items-center gap-2 outline-none group w-fit">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors group-hover:bg-white" style={{ background: P.panelAlt, borderColor: P.border }}>
              <Sparkles className="w-5 h-5" style={{ color: P.gold }} />
            </div>
          </Link>
        </div>

        {/* ── Middle Centered Content ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          
          {/* Floating Humorous Widget */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
            className="relative mb-14 p-7 rounded-3xl border shadow-2xl backdrop-blur-md w-full max-w-sm text-left"
            style={{ background: "rgba(255, 255, 255, 0.45)", borderColor: "rgba(255, 255, 255, 0.6)", boxShadow: "0 24px 64px rgba(176,125,46,0.15)" }}>
            
            {/* Inner Glare */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none border border-white/80" style={{ mixBlendMode: "overlay" }} />

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-white/50" style={{ color: P.gold }}>
                <span className="text-2xl">☕</span>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1" style={{ color: P.gold }}>Reality Check</p>
                <h3 className="text-lg font-semibold whitespace-nowrap" style={{ color: P.text }}>Code Authenticity</h3>
              </div>
            </div>
            
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between text-xs font-semibold">
                <span style={{ color: P.textSub }}>StackOverflow Snippets</span>
                <span style={{ color: P.gold }}>94%</span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "rgba(176,125,46,0.15)" }}>
                <motion.div className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #D4A24A, #B07D2E)" }} 
                  initial={{ width: "0%" }} animate={{ width: "94%" }} transition={{ delay: 0.9, duration: 1.5, ease: "circOut" }} />
              </div>
            </div>

            {/* Secondary Floating Humour Pill */}
            <motion.div 
              initial={{ y: -10, opacity: 0, x: 20 }} animate={{ y: 0, opacity: 1, x: 0 }} transition={{ delay: 0.7, duration: 0.8 }}
              className="absolute -right-6 -bottom-6 z-30 p-3.5 pr-5 rounded-2xl border shadow-xl flex items-center gap-3 backdrop-blur-xl"
              style={{ background: "rgba(255, 255, 255, 0.7)", borderColor: "rgba(255, 255, 255, 0.8)", boxShadow: "0 12px 32px rgba(28,22,14,0.08)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-100/50 text-amber-700 font-bold border border-amber-200">
                !
              </div>
              <div className="text-xs font-bold tracking-wide" style={{ color: P.text }}>Powered by Caffeine</div>
            </motion.div>
          </motion.div>

          {/* Hero Typography */}
          <div className="text-center flex flex-col items-center">
            <h2 className="text-5xl font-normal leading-[1.1] tracking-tight mb-6" style={{ color: P.text, fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
              Elevate your <br/>
              <span className="italic" style={{ color: P.gold }}>career journey.</span>
            </h2>
            <p className="text-base font-light leading-relaxed max-w-sm" style={{ color: P.textSub }}>
              Upload your resume, verify your skill gaps against elite tech giants, and construct an airtight application narrative.
            </p>
            
            <div className="mt-10 flex justify-center gap-4 items-center">
               <div className="flex -space-x-3">
                 {[
                   "https://i.pravatar.cc/100?img=1",
                   "https://i.pravatar.cc/100?img=2",
                   "https://i.pravatar.cc/100?img=3"
                 ].map((src, i) => (
                   <img key={i} src={src} alt="User" className="w-10 h-10 rounded-full border-2 border-[#FAF7F2] object-cover" />
                 ))}
                 <div className="w-10 h-10 rounded-full border-2 border-[#FAF7F2] bg-white flex items-center justify-center text-[10px] font-bold shadow-sm" style={{ color: P.gold }}>
                   +2k
                 </div>
               </div>
               <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: P.textMuted }}>Engineers Hired</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Split (Form Container) ── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 relative">
        <div className="absolute inset-0 opacity-20 mix-blend-multiply lg:hidden" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }} />
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2 outline-none w-fit">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-white" style={{ borderColor: P.border }}>
              <Sparkles className="w-5 h-5" style={{ color: P.gold }} />
            </div>
          </Link>
        </div>

        <div ref={formRef} className="w-full max-w-[420px] relative z-10">
          
          <div className="mb-10 lg:hidden text-center">
            <h1 className="text-4xl font-normal tracking-tight mb-2" style={{ color: P.text, fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>
              Welcome back.
            </h1>
            <p className="text-sm font-light" style={{ color: P.textSub }}>Sign in to continue your analysis.</p>
          </div>
          
          <div className="hidden lg:block mb-8 text-center">
            <h1 className="text-3xl font-normal tracking-tight mb-2" style={{ color: P.text, fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>Welcome.</h1>
            <p className="text-sm font-light" style={{ color: P.textSub }}>Sign in or create a new account — same form, same place.</p>
          </div>

          <div className="rounded-3xl p-8 sm:p-10 border bg-white shadow-xl relative"
            style={{ borderColor: P.border, boxShadow: P.shadow }}>
            
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(176,125,46,0.3), transparent)" }} />
            
            <GoogleLoginBtn />

            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px" style={{ background: P.border }} />
              <span className="text-[10px] uppercase font-semibold tracking-widest" style={{ color: P.textMuted }}>Or continue with email</span>
              <div className="flex-1 h-px" style={{ background: P.border }} />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              
              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-[11px] font-semibold tracking-wide uppercase ml-1" style={{ color: P.textSub }}>
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
                    <User className="w-4 h-4 transition-colors" style={{ color: P.textMuted }} />
                  </div>
                  <input id="name" type="text" placeholder="John Doe"
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium outline-none transition-all duration-300 bg-transparent border placeholder-opacity-50"
                    style={{ color: P.text, borderColor: P.border }}
                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={e => { e.target.style.borderColor = P.gold; e.target.style.background = "#FAF7F2"; e.target.previousSibling.firstChild.style.color = P.gold; }}
                    onBlur={e => { e.target.style.borderColor = P.border; e.target.style.background = "transparent"; e.target.previousSibling.firstChild.style.color = P.textMuted; }}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[11px] font-semibold tracking-wide uppercase ml-1" style={{ color: P.textSub }}>
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 transition-colors" style={{ color: P.textMuted }} />
                  </div>
                  <input id="email" type="email" required placeholder="name@domain.com"
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium outline-none transition-all duration-300 bg-transparent border placeholder-opacity-50"
                    style={{ color: P.text, borderColor: P.border }}
                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={e => { e.target.style.borderColor = P.gold; e.target.style.background = "#FAF7F2"; e.target.previousSibling.firstChild.style.color = P.gold; }}
                    onBlur={e => { e.target.style.borderColor = P.border; e.target.style.background = "transparent"; e.target.previousSibling.firstChild.style.color = P.textMuted; }}
                  />
                </div>
              </div>
              
              {/* Password Input */}
              <div className="space-y-1.5 pb-2">
                <div className="flex items-center justify-between ml-1">
                  <label htmlFor="password" className="text-[11px] font-semibold tracking-wide uppercase" style={{ color: P.textSub }}>
                    Password
                  </label>
                  <Link to="#" className="text-[10px] font-medium transition-colors hover:underline" style={{ color: P.gold }}>
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-0 bottom-0 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 transition-colors" style={{ color: P.textMuted }} />
                  </div>
                  <input id="password" type="password" required placeholder="••••••••"
                    className="w-full h-12 pl-11 pr-4 rounded-xl text-sm font-medium outline-none transition-all duration-300 bg-transparent border placeholder-opacity-50"
                    style={{ color: P.text, borderColor: P.border }}
                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={e => { e.target.style.borderColor = P.gold; e.target.style.background = "#FAF7F2"; e.target.previousSibling.firstChild.style.color = P.gold; }}
                    onBlur={e => { e.target.style.borderColor = P.border; e.target.style.background = "transparent"; e.target.previousSibling.firstChild.style.color = P.textMuted; }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isLoading}
                className="relative w-full h-12 mt-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300 overflow-hidden group outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: P.text, color: P.bg, boxShadow: "0 4px 14px rgba(28,22,14,0.15)" }}>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                
                {isLoading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: P.bg, borderTopColor: "transparent" }} />
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

          </div>

        </div>
      </div>
    </div>
  );
}
