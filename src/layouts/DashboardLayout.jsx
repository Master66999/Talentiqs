import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut, Home, ArrowLeft, Gem, Activity, Target, Brain, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import AutomationModal from "../components/AutomationModal";
import { useEffect, useRef, useState } from "react";
import { MessageSquare } from "lucide-react";
import { gsap } from "gsap";

// ─── Creamy Light Palette ──────────────────────────────────────────────────────
const P = {
  bg:        "#FAF7F2",          // warm cream page
  sidebar:   "#FFFFFF",          // clean white sidebar
  panel:     "#FFFFFF",          // white cards
  panelAlt:  "#F5F0E8",          // slightly tinted card
  gold:      "#B07D2E",          // rich antique gold
  goldLight: "#D4A24A",          // lighter gold for hovers
  goldBg:    "rgba(176,125,46,0.08)",
  rose:      "#C4705A",          // warm terracotta rose
  roseBg:    "rgba(196,112,90,0.08)",
  sage:      "#6B8F71",          // muted sage green accent
  sageBg:    "rgba(107,143,113,0.1)",
  text:      "#1C160E",          // dark warm brown — crisp on light
  textSub:   "#6B5B45",          // medium warm brown
  textMuted: "#A89178",          // soft muted warm grey
  border:    "rgba(176,125,46,0.18)",
  borderSub: "rgba(28,22,14,0.07)",
  shadow:    "0 1px 4px rgba(28,22,14,0.06), 0 4px 24px rgba(28,22,14,0.04)",
  shadowHov: "0 4px 20px rgba(176,125,46,0.15), 0 1px 4px rgba(28,22,14,0.08)",
};

// ─── Soft particle canvas ─────────────────────────────────────────────────────
function WarmCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let w, h;

    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const nodes = Array.from({ length: 38 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      nodes.forEach((n) => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });
      nodes.forEach((a, i) => {
        nodes.slice(i + 1).forEach((b) => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(176,125,46,${0.12 * (1 - d / 140)})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        });
      });
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(176,125,46,0.28)";
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function DashboardLayout() {
  const location  = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const sidebarRef = useRef(null);
  const [isAutomationOpen, setIsAutomationOpen] = useState(false);

  const pageTitle =
    location.pathname.includes("/it") && !location.pathname.includes("non") ? "IT Professional" :
    location.pathname.includes("non-it")     ? "Non-IT Professional" :
    location.pathname.includes("competitive") ? "Competitive Exams"   : 
    location.pathname.includes("startup") ? "Startup & Product" :
    location.pathname.includes("internship") ? "Student Internship" : "Overview";

  const onReset = () => {
    const category = location.pathname.split('/').pop();
    localStorage.removeItem(`analysis_${category}`);
    window.location.reload();
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (sidebarRef.current) {
      gsap.fromTo(sidebarRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" });
    }
    // Track last visited dashboard category
    if (location.pathname.includes('/dashboard/') && 
        !['profile', 'career-builder', 'verification'].some(p => location.pathname.includes(p))) {
      localStorage.setItem('last_category_path', location.pathname);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex relative" style={{ background: P.bg }}>
      {/* Sidebar */}
      <aside ref={sidebarRef} className="w-64 flex flex-col fixed inset-y-0 z-20 border-r"
        style={{ background: P.sidebar, borderColor: P.borderSub, boxShadow: "2px 0 16px rgba(28,22,14,0.04)" }}>

        {/* Logo */}
        <div className="h-20 flex items-center px-8 border-b" style={{ borderColor: P.borderSub }}>
          <Link to="/" className="flex items-center gap-3 group no-underline">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: P.goldBg, border: `1.5px solid ${P.border}` }}>
              <Gem className="w-5 h-5" style={{ color: P.gold }} />
            </div>
            <span className="font-black text-xl tracking-tighter" style={{ color: P.text }}>
              TalentI<span style={{ color: P.gold }}>QS</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
          <div className="px-4 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Menu</div>
          
          <Link to={location.pathname.includes('/profile') || location.pathname.includes('/career-builder') || location.pathname.includes('/verification') ? (localStorage.getItem('last_category_path') || '/dashboard/it') : location.pathname} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest no-underline transition-all ${!location.pathname.includes('profile') && !location.pathname.includes('career-builder') && !location.pathname.includes('verification') ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <Activity className="w-4 h-4" /> Overview
          </Link>

          <button onClick={() => {
            if (location.pathname.includes('profile') || location.pathname.includes('builder')) {
              navigate(localStorage.getItem('last_category_path') || '/dashboard/it');
              setTimeout(() => scrollToSection('opportunities'), 500);
            } else scrollToSection('opportunities');
          }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest no-underline text-gray-500 hover:bg-gray-100 bg-transparent border-none cursor-pointer">
            <Target className="w-4 h-4" /> Opportunities
          </button>

          <button onClick={() => {
            if (location.pathname.includes('profile') || location.pathname.includes('builder')) {
              navigate(localStorage.getItem('last_category_path') || '/dashboard/it');
              setTimeout(() => scrollToSection('Skill Matrix'), 500);
            } else scrollToSection('Skill Matrix');
          }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest no-underline text-gray-500 hover:bg-gray-100 bg-transparent border-none cursor-pointer">
            <Brain className="w-4 h-4" /> Skill Matrix
          </button>

          <div className="h-px my-6 mx-4" style={{ background: P.borderSub }} />
          
          <div className="px-4 mb-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">System</div>

          <Link to="/dashboard/profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest no-underline transition-all ${location.pathname.includes('profile') ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <User className="w-4 h-4" /> Profile
          </Link>

          <button onClick={onReset} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest no-underline text-gray-500 hover:bg-gray-100 bg-transparent border-none cursor-pointer">
            <RefreshCw className="w-4 h-4" /> Reset Analysis
          </button>

          <button onClick={() => setIsAutomationOpen(true)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest no-underline text-white bg-black hover:bg-gray-800 border-none cursor-pointer mt-4">
            <MessageSquare className="w-4 h-4" /> Automate
          </button>
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t" style={{ borderColor: P.borderSub }}>
          {user && (
            <div className="flex items-center gap-3 px-2 py-3 mb-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black bg-white border border-gray-200">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black truncate">{user.name}</span>
                <span className="text-[9px] font-bold text-gray-400 uppercase">Premium Member</span>
              </div>
            </div>
          )}
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all bg-transparent border-none cursor-pointer">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        <div className="flex-1 p-12">
          <Outlet />
        </div>
        <Footer />
      </main>

      <AutomationModal isOpen={isAutomationOpen} onClose={() => setIsAutomationOpen(false)} />
    </div>
  );
}
