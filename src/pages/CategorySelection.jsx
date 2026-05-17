import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";
import { motion, useScroll, useTransform, AnimatePresence, useVelocity, useSpring, useAnimationFrame, useMotionValue } from "framer-motion";
import { Home, ArrowRight } from "lucide-react";

// ─── Theme Colors ─────────────────────────────────────────────────────────────
const P = {
  bg: "#FAF7F2",
  text: "#2D231E",
  textSub: "#6B5749",
  cardBg: "#FFFFFF",
  cardBorder: "rgba(45,35,30,0.08)",
  accentGold: "#D4A24A",
  accentSage: "#7A9E7E",
  accentRust: "#C4705A",
  accentSlate: "#6E7E85"
};

// ─── Shared Components & Effects ──────────────────────────────────────────────

function CrosshairCursor() {
  const hLineRef = useRef(null);
  const vLineRef = useRef(null);
  const dotRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let frame;
    let isVisible = false;

    const handleMouseMove = (e) => {
      if (!isVisible && containerRef.current) {
        containerRef.current.style.opacity = "1";
        isVisible = true;
      }
      
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (hLineRef.current) hLineRef.current.style.transform = `translate3d(0, ${e.clientY}px, 0)`;
        if (vLineRef.current) vLineRef.current.style.transform = `translate3d(${e.clientX}px, 0, 0)`;
        if (dotRef.current) dotRef.current.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
      });
    };

    const handleMouseLeave = () => {
      if (containerRef.current) containerRef.current.style.opacity = "0";
      isVisible = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <style>{`
        body, a, button, input, textarea, [role="button"] { 
          cursor: none !important; 
        }
      `}</style>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[9999] opacity-0 transition-opacity duration-300">
        <div ref={hLineRef} className="absolute top-0 left-0 w-full h-[1px] bg-[#D4A24A]/40 mix-blend-multiply" style={{ willChange: 'transform' }} />
        <div ref={vLineRef} className="absolute top-0 left-0 h-full w-[1px] bg-[#D4A24A]/40 mix-blend-multiply" style={{ willChange: 'transform' }} />
        <div ref={dotRef} className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#D4A24A]" style={{ willChange: 'transform' }} />
      </div>
    </>
  );
}

function DodgingWord({ children, mousePos }) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = centerX - mousePos.x;
    const dy = centerY - mousePos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const maxDist = 130; // Evade radius
    if (dist < maxDist && dist > 0) {
       const force = Math.pow((maxDist - dist) / maxDist, 1.5);
       const pushX = (dx / dist) * force * 35; // push strength X
       const pushY = (dy / dist) * force * 25; // push strength Y
       setOffset({ x: pushX, y: pushY });
    } else {
       setOffset({ x: 0, y: 0 });
    }
  }, [mousePos]);

  return (
    <motion.span 
      ref={ref} 
      className="inline-block"
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 350, damping: 20 }}
    >
      {children}
    </motion.span>
  );
}

function InteractiveHeading({ accentColor, textColor, subTextColor }) {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  
  useEffect(() => {
    let frame;
    const handleMouse = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setMousePos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("mousemove", handleMouse);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(frame);
    };
  }, []);

  const Line1 = ["Shape", "Your", "Career"];
  const Line2 = ["With", "Intelligence."];
  const Sub = ["Scroll", "to", "explore", "dedicated", "pathways", "designed", "for", "technology,", "business", "strategy,", "enterprise", "exams,", "and", "foundational", "growth."];

  return (
    <>
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-6xl md:text-8xl font-playfair mb-8 leading-[1.1] z-20 pointer-events-auto" style={{ color: textColor }}>
        <span className="font-medium tracking-tight">
          {Line1.map((word, i) => <DodgingWord key={"L1"+i} mousePos={mousePos}>{word}&nbsp;</DodgingWord>)}
        </span>
        <br/>
        <span className="italic tracking-normal" style={{ color: accentColor }}>
          {Line2.map((word, i) => <DodgingWord key={"L2"+i} mousePos={mousePos}>{word}&nbsp;</DodgingWord>)}
        </span>
      </motion.h1>
      
      <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed z-20 pointer-events-auto flex flex-wrap justify-center gap-y-1 gap-x-[0.25em]" style={{ color: subTextColor }}>
        {Sub.map((word, i) => <DodgingWord key={"S"+i} mousePos={mousePos}>{word}</DodgingWord>)}
      </motion.p>
    </>
  );
}

function ParallaxNumber({ index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 0.04, 0.04, 0]);

  return (
    <motion.div 
      ref={ref}
      style={{ y, opacity }} 
      className="absolute right-[-5%] top-1/2 -translate-y-1/2 text-[45vw] font-black leading-none pointer-events-none select-none text-[#2D231E]"
    >
      0{index}
    </motion.div>
  );
}

function SectionLayout({ id, index, badgeTitle, title, description, accentColor, alignRight, ctaLink, children }) {
  return (
    <section id={id} className="min-h-screen relative flex items-center justify-center py-24 overflow-hidden border-b border-black/5" style={{ backgroundColor: P.bg }}>
      <ParallaxNumber index={index} />
      
      <div className="max-w-7xl w-full mx-auto px-6 sm:px-12 relative z-10 flex flex-col md:flex-row gap-16 items-center">
        
        {/* Left Side Content (if not alignRight) */}
        {!alignRight && (
           <div className="flex-1 w-full text-left order-2 md:order-1">
             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.8 }}>
               <h3 className="text-sm font-black tracking-[0.2em] uppercase mb-4" style={{ color: accentColor }}>{badgeTitle}</h3>
               <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight" style={{ color: P.text }}>{title}</h2>
               <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: P.textSub }}>{description}</p>
               
               <Link to={ctaLink} className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-transform hover:-translate-y-1 hover:shadow-lg text-white" style={{ backgroundColor: accentColor }}>
                 Explore Path <ArrowRight className="w-4 h-4" />
               </Link>
             </motion.div>
           </div>
        )}

        {/* Center/Card Content */}
        <div className={`flex-1 w-full order-1 ${!alignRight ? 'md:order-2' : 'md:order-1'}`}>
           <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.8, delay: 0.2 }} className="px-4 md:px-0">
             {children}
           </motion.div>
        </div>

        {/* Right Side Content (if alignRight is true) */}
        {alignRight && (
           <div className="flex-1 w-full text-left order-2 md:order-2 md:pl-12">
             <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.8 }}>
               <h3 className="text-sm font-black tracking-[0.2em] uppercase mb-4" style={{ color: accentColor }}>{badgeTitle}</h3>
               <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight" style={{ color: P.text }}>{title}</h2>
               <p className="text-lg leading-relaxed mb-10 max-w-md" style={{ color: P.textSub }}>{description}</p>
               
               <Link to={ctaLink} className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold transition-transform hover:-translate-y-1 hover:shadow-lg" style={{ backgroundColor: P.cardBg, color: accentColor, border: `2px solid ${accentColor}` }}>
                 Explore Path <ArrowRight className="w-4 h-4" />
               </Link>
             </motion.div>
           </div>
        )}
      </div>
    </section>
  );
}

// ─── Visual Cards for Sections ────────────────────────────────────────────────

function VisualIT() {
  const lines = [
    { indent: 0, text: "const candidate = {", color: "#6B5749" },
    { indent: 1, text: 'role: "SWE / Cloud / ML",', color: "#839777" },
    { indent: 1, text: 'target: "FAANG + Startups",', color: "#839777" },
    { indent: 1, text: 'status:', color: "#6B5749" },
    { indent: 2, text: '"Analyzing technical gaps…"', color: "#C99A41" },
    { indent: 0, text: "}", color: "#6B5749" },
  ];

  return (
    <div className="rounded-[40px] overflow-hidden bg-white shadow-2xl border" style={{ borderColor: P.cardBorder }}>
      <div className="h-4 w-full" style={{ background: "linear-gradient(90deg, #D4A24A, #7A9E7E)" }} />
      <div className="p-8">
        <div className="rounded-2xl border bg-[#FDFBF7] overflow-hidden shadow-inner" style={{ borderColor: P.cardBorder }}>
          <div className="h-10 border-b flex items-center px-5 gap-2 bg-[#F5EBE0]" style={{ borderColor: P.cardBorder }}>
            {["#C4705A","#D4A24A","#7A9E7E"].map((c,i)=><div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />)}
            <span className="text-[11px] font-mono ml-4 tracking-widest text-[#6B5749]">analysis.js</span>
          </div>
          <div className="p-8 font-mono text-sm leading-[2.5] flex-col">
            {lines.map((line, i) => (
              <div key={i} className="flex">
                <span className="text-gray-300 w-6 flex-shrink-0 select-none text-right mr-5">{i + 1}</span>
                <span style={{ paddingLeft: line.indent * 24, color: line.color, fontWeight: 600 }}>{line.text}</span>
              </div>
            ))}
            <div className="flex items-center">
               <span className="text-gray-300 w-6 flex-shrink-0 select-none text-right mr-5">{lines.length + 1}</span>
               <motion.span className="w-2.5 h-4 rounded-sm" style={{ backgroundColor: P.accentGold }} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
           {["React","Node.js","Docker","AWS"].map(t=>(
             <span key={t} className="px-4 py-1.5 rounded-full text-xs font-bold border" style={{ borderColor: P.cardBorder, color: P.textSub }}>{t}</span>
           ))}
        </div>
      </div>
    </div>
  );
}

function VisualNonIT() {
  const bars = [
    { label: "Marketing", pct: 87, color: P.accentGold },
    { label: "Sales", pct: 72, color: P.accentRust },
    { label: "Operations", pct: 65, color: P.accentSage },
    { label: "Consulting", pct: 91, color: P.accentGold },
  ];

  return (
    <div className="rounded-[40px] overflow-hidden bg-white shadow-2xl border" style={{ borderColor: P.cardBorder }}>
      <div className="h-4 w-full" style={{ background: "linear-gradient(90deg, #C4705A, #D4A24A)" }} />
      <div className="p-10">
        <h4 className="text-lg font-black text-center mb-8" style={{ color: P.text }}>Domain Strength Matrix</h4>
        <div className="flex flex-col gap-6">
          {bars.map((bar, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-sm font-bold w-24 flex-shrink-0 text-right" style={{ color: P.textSub }}>{bar.label}</span>
              <div className="flex-1 h-3 rounded-full overflow-hidden bg-gray-100 shadow-inner">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: bar.color }}
                  initial={{ width: 0 }} whileInView={{ width: `${bar.pct}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: i * 0.15 }} />
              </div>
              <span className="text-xs font-black w-10 text-right" style={{ color: bar.color }}>{bar.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisualExams() {
  const stats = [
    { label: "Civil Services", value: "UPSC IAS", icon: "🏛️" },
    { label: "Staff Selection", value: "SSC CGL", icon: "📋" },
    { label: "Public Banking", value: "IBPS / SBI", icon: "🏦" },
    { label: "Engineering PG", value: "GATE", icon: "🎓" },
  ];

  return (
    <div className="rounded-[40px] overflow-hidden bg-white shadow-2xl border" style={{ borderColor: P.cardBorder }}>
      <div className="h-4 w-full" style={{ background: "linear-gradient(90deg, #6E7E85, #A36B53)" }} />
      <div className="p-10 text-center">
        <div className="relative mb-10 w-32 h-32 mx-auto">
          <svg width="128" height="128" viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#F5EBE0" strokeWidth="6" />
            <motion.circle cx="50" cy="50" r="46" fill="none"
              stroke={P.accentSlate} strokeWidth="6" strokeLinecap="round" strokeDasharray={289}
              initial={{ strokeDashoffset: 289 }} whileInView={{ strokeDashoffset: 289 * 0.28 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.3 }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-4xl">🏆</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 + 0.3 }}
              className="p-5 rounded-2xl border bg-[#FDFBF7]" style={{ borderColor: P.cardBorder }}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-sm font-black" style={{ color: P.text }}>{s.label}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: P.accentSlate }}>{s.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisualInternship() {
  const miles = [
    { label: "Resume Polished", done: true },
    { label: "Cover Letter", done: true },
    { label: "Mock Interview", done: false },
    { label: "Offer Secured", done: false },
  ];

  return (
    <div className="rounded-[40px] overflow-hidden bg-white shadow-2xl border" style={{ borderColor: P.cardBorder }}>
      <div className="h-4 w-full" style={{ background: "linear-gradient(90deg, #7A9E7E, #D4A24A)" }} />
      <div className="p-14">
        <h4 className="text-lg font-black mb-8 px-2" style={{ color: P.text }}>Your Journey Tracker</h4>
        <div className="flex flex-col gap-7 relative">
          <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-gray-100" />
          {miles.map((m, i) => (
            <div key={i} className="flex items-center gap-6 relative z-10">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${m.done ? "bg-[#7A9E7E] text-white" : "bg-white border-2 border-gray-200"}`}>
                {m.done && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span className={`text-base font-bold ${m.done ? "text-[#2D231E]" : "text-gray-400"}`}>{m.label}</span>
              {!m.done && <span className="ml-auto flex-shrink-0 text-[10px] font-bold uppercase tracking-widest text-[#D4A24A]">Pending</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VisualStartup() {
  const metrics = [
    { label: "MRR", value: "$12k", up: true },
    { label: "Users", value: "3.4k", up: true },
    { label: "Burn", value: "$8.2k", up: false },
    { label: "NPS", value: "74", up: true },
  ];

  return (
    <div className="rounded-[40px] overflow-hidden bg-white shadow-2xl border" style={{ borderColor: P.cardBorder }}>
      <div className="h-4 w-full" style={{ background: "linear-gradient(90deg, #C4705A, #A36B53)" }} />
      <div className="p-10">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-lg font-black" style={{ color: P.text }}>P&L Snapshot</h4>
          <span className="text-2xl animate-bounce">🚀</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl border bg-[#FDFBF7]" style={{ borderColor: P.cardBorder }}>
              <div className="text-[11px] font-black uppercase tracking-wider mb-2" style={{ color: P.textSub }}>{m.label}</div>
              <div className="text-3xl font-black" style={{ color: P.text }}>{m.value}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Fixed Navigation ─────────────────────────────────────────────────────────

function MagnetGrid() {
  const containerRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      
      // Throttle/smooth using rAF if wanted, but standard rAF loop is better:
      // Just do direct manipulation
      const lines = containerRef.current.querySelectorAll('.magnet-line');
      lines.forEach(line => {
        const lRect = line.getBoundingClientRect();
        const lX = lRect.left + lRect.width / 2;
        const lY = lRect.top + lRect.height / 2;
        
        const dx = e.clientX - lX;
        const dy = e.clientY - lY;
        
        const angle = Math.atan2(dy, dx);
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const maxDist = 350; // effect radius
        const intensity = Math.max(0, 1 - dist / maxDist);
        
        line.style.transform = `rotate(${angle}rad) scale(${1 + intensity * 0.4})`;
        line.style.opacity = `${0.1 + intensity * 0.5}`;
      });
    };
    
    const handleMouseLeave = () => {
       if (!containerRef.current) return;
       const lines = containerRef.current.querySelectorAll('.magnet-line');
       lines.forEach(line => {
          line.style.transform = `rotate(0rad) scale(1)`;
          line.style.opacity = `0.1`;
       });
    };

    const container = containerRef.current.closest('section');
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // 15 cols, 8 rows matrix of lines
  return (
    <div ref={containerRef} className="absolute inset-x-0 inset-y-10 z-0 overflow-hidden pointer-events-none flex flex-col justify-between px-10 md:px-20">
      {Array.from({ length: 8 }).map((_, rowI) => (
         <div key={rowI} className="flex justify-between items-center w-full">
           {Array.from({ length: 14 }).map((_, colI) => (
              <div key={colI} className="w-8 h-8 flex items-center justify-center">
                 <div className="magnet-line w-1 h-6 rounded-full origin-center opacity-10 transition-all duration-75 ease-out" style={{ backgroundColor: P.accentGold }} />
              </div>
           ))}
         </div>
      ))}
    </div>
  );
}

function SideNav({ activeId }) {
  const links = [
    { id: "intro", label: "Start" },
    { id: "it", label: "IT Path" },
    { id: "non-it", label: "Strategy" },
    { id: "competitive", label: "Exams" },
    { id: "internship", label: "Intern" },
    { id: "startup", label: "Startup" }
  ];

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-5">
      {links.map((link) => (
        <a 
          key={link.id} 
          href={`#${link.id}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group flex flex-col items-end gap-1.5 cursor-pointer outline-none"
        >
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${activeId === link.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 group-hover:opacity-50"} text-[#2D231E]`}>
            {link.label}
          </span>
          <div className="flex items-center justify-end w-full pr-1">
            <div className={`rounded-full transition-all duration-300 border-2 ${activeId === link.id ? "w-3 h-3 bg-[#D4A24A] border-[#D4A24A]" : "w-1.5 h-1.5 bg-transparent border-[#6B5749]/30 group-hover:border-[#6B5749]"}`} />
          </div>
        </a>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CategorySelection() {
  const { user } = useAuth();
  const [activeId, setActiveId] = useState("intro");

  // Intersection Observer to track active section for the navbar
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, { rootMargin: "-40% 0px -40% 0px" }); // trigger when crossing middle of screen

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(s => observer.observe(s));
    return () => sections.forEach(s => observer.unobserve(s));
  }, []);

  return (
    <div className="relative font-sans text-gray-900" style={{ backgroundColor: P.bg }}>
      
      <CrosshairCursor />

      {/* Global Navbar Link */}
      <div className="fixed top-8 left-8 z-50">
        <Link to="/" className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: P.cardBorder, color: P.textSub }}>
          <Home className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Home</span>
        </Link>
      </div>

      <SideNav activeId={activeId} />

      {/* ─── Intro Section ─── */}
      <section id="intro" className="min-h-screen flex items-center justify-center relative overflow-hidden border-b border-black/5 group">
        {/* Subtle noise */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
             style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "256px" }} />
             
        {/* Interactive Magnet Grid */}
        <MagnetGrid />     
             
        <div className="max-w-4xl px-6 relative z-10 text-center pointer-events-none">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="inline-block px-5 py-2 rounded-full border shadow-sm bg-white mb-10 pointer-events-auto relative z-20" style={{ borderColor: P.cardBorder }}>
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: P.accentGold }}>{user?.name || "Welcome"} — Select Your Track</span>
          </motion.div>
          
          <InteractiveHeading accentColor={P.accentGold} textColor={P.text} subTextColor={P.textSub} />
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="mt-8 relative z-30">
            <div className="w-px h-16 mx-auto line-gradient" style={{ background: `linear-gradient(to bottom, transparent, ${P.accentGold}, transparent)` }} />
          </motion.div>
        </div>

      </section>

      {/* ─── Category Sections ─── */}
      <SectionLayout 
        id="it" index={1} 
        badgeTitle="Technology & Engineering" 
        title="IT Professional" 
        description="For software engineers, data scientists, and cloud architects. Optimize your resume for FAANG and high-growth Silicon Valley startups using hyper-specific technical gap analysis."
        accentColor={P.accentGold}
        ctaLink="/dashboard/it"
      >
        <VisualIT />
      </SectionLayout>

      <SectionLayout 
        id="non-it" index={2} alignRight
        badgeTitle="Business & Strategy" 
        title="Non-IT Roles" 
        description="For marketing, sales, human resources, and operations. Focus on projecting domain competency and measurable organizational impact to pass non-technical recruiter screens."
        accentColor={P.accentRust}
        ctaLink="/dashboard/non-it"
      >
        <VisualNonIT />
      </SectionLayout>

      <SectionLayout 
        id="competitive" index={3} 
        badgeTitle="Public Enterprise" 
        title="Competitive Exams" 
        description="Civil services, public banking, and postgraduate qualifications. Tailor your profile for massive corporate and governmental hierarchies."
        accentColor={P.accentSlate}
        ctaLink="/dashboard/competitive"
      >
        <VisualExams />
      </SectionLayout>

      <SectionLayout 
        id="internship" index={4} alignRight
        badgeTitle="Foundational Growth" 
        title="Internship" 
        description="University students and fresh graduates. Break into the industry by prioritizing portfolio projects, soft skills, and academic excellence over extensive work history."
        accentColor={P.accentSage}
        ctaLink="/dashboard/internship"
      >
        <VisualInternship />
      </SectionLayout>

      <SectionLayout 
        id="startup" index={5} 
        badgeTitle="Hyper-Growth" 
        title="Startup Founder" 
        description="0 to 1 operators and early stage visionaries. Highlight your ability to scale metrics, secure funding, and maintain extraordinary burn-rate efficiency."
        accentColor={P.accentRust}
        ctaLink="/dashboard/startup"
      >
        <VisualStartup />
      </SectionLayout>

      <div className="relative z-10 w-full mt-auto bg-white border-t" style={{ borderColor: P.cardBorder }}>
        <Footer />
      </div>

    </div>
  );
}
