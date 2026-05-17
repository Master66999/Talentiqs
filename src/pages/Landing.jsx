import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, Star, Zap, Target, Shield, BarChart2, Cpu } from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Squares from '../components/Squares';
import SpotlightCard from '../components/SpotlightCard';
import TVCarousel from '../components/TVCarousel';
import PixelTransition from '../components/PixelTransition';
import ParallaxText from '../components/ParallaxText';

/* ─── animation variants ─── */
const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.25, delayChildren: 0.1 } },
};
const slideUp = {
  hidden: { opacity: 0, y: 70 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 35, damping: 15, mass: 1.2 } },
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

/* ─── feature cards data ─── */
const FEATURES = [
  {
    icon: <Zap className="w-6 h-6" />,
    color: "from-[#38BDF8] to-[#818CF8]",
    glow: "rgba(56,189,248,0.25)",
    title: "Instant Resume Parsing",
    desc: "Drop your PDF or DOCX and watch our AI extract every skill, role, and keyword in under 3 seconds.",
    tag: "Speed",
  },
  {
    icon: <Target className="w-6 h-6" />,
    color: "from-[#F472B6] to-[#C026D3]",
    glow: "rgba(244,114,182,0.25)",
    title: "Company Targeting",
    desc: "Pick from Google, Amazon, Microsoft, Goldman Sachs, top startups and 200+ more. We tailor the gap report to their exact hiring bar.",
    tag: "Precision",
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    color: "from-[#34D399] to-[#059669]",
    glow: "rgba(52,211,153,0.25)",
    title: "Skill Gap Scoring",
    desc: "Get a percentage-based readiness score, a heatmap of missing competencies, and a prioritized action list.",
    tag: "Analytics",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    color: "from-[#FBBF24] to-[#F59E0B]",
    glow: "rgba(251,191,36,0.25)",
    title: "ATS Compatibility Check",
    desc: "Know if your resume survives the Applicant Tracking System filter before a human even sees it.",
    tag: "ATS",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    color: "from-[#A78BFA] to-[#7C3AED]",
    glow: "rgba(167,139,250,0.25)",
    title: "AI Rewrite Suggestions",
    desc: "Receive GPT-powered bullet-point rewrites that align your experience with what the hiring team is actually looking for.",
    tag: "AI",
  },
  {
    icon: <Star className="w-6 h-6" />,
    color: "from-[#FB923C] to-[#EF4444]",
    glow: "rgba(251,146,60,0.25)",
    title: "Interview Readiness",
    desc: "Based on your gap report, get a curated set of likely interview questions and model answers tailored to the role.",
    tag: "Prep",
  },
];

/* ─── stats ─── */
const STATS = [
  { value: "200+", label: "Companies tracked" },
  { value: "98%", label: "ATS pass rate improvement" },
  { value: "3 sec", label: "Parse time" },
  { value: "40k+", label: "Resumes analyzed" },
];

/* ─── testimonials ─── */
const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "SWE @ Google",
    avatar: "PS",
    color: "from-[#38BDF8] to-[#818CF8]",
    text: "I was rejected twice before using this. The gap report told me exactly what I was missing — two weeks later I had an offer.",
  },
  {
    name: "Marcus Evans",
    role: "PM @ Amazon",
    avatar: "ME",
    color: "from-[#34D399] to-[#059669]",
    text: "The ATS check alone is worth it. My resume was getting filtered before any human even read it. Fixed that in an afternoon.",
  },
  {
    name: "Aisha Okonkwo",
    role: "Data Analyst @ Meta",
    avatar: "AO",
    color: "from-[#F472B6] to-[#C026D3]",
    text: "The AI rewrite suggestions transformed my bullet points from generic to genuinely compelling. Landed 4 interviews in a week.",
  },
];

/* ─── decrypted text helper ─── */
const DecryptedText = ({ text, isHovered }) => {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }
    let iteration = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#*%";
    const interval = setInterval(() => {
      setDisplayText(text.split("").map((c, i) => {
        if (c === " ") return " ";
        if (i < Math.floor(iteration)) return text[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 2.5;
    }, 30);
    return () => clearInterval(interval);
  }, [isHovered, text]);

  return <span>{displayText}</span>;
}

/* ══════════════════════════════════════════════ */
export default function Landing() {
  /* ── feature slider state ── */
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActiveIdx((p) => (p + 1) % FEATURES.length);
    }, 2000);
    return () => clearInterval(t);
  }, [paused]);

  /* ── parallax ── */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const textOp = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  /* ── testimonial index ── */
  const [tIdx, setTIdx] = useState(0);

  /* ── process gradual blur & hover ── */
  const processRef = useRef(null);
  const { scrollYProgress: blurSpy } = useScroll({ target: processRef, offset: ["0 1", "0.6 1"] });
  const processBlur = useTransform(blurSpy, [0, 1], ["blur(20px)", "blur(0px)"]);
  const processOpac = useTransform(blurSpy, [0, 1], [0, 1]);
  const [hoveredProcess, setHoveredProcess] = useState(null);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-[#040405]" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen overflow-hidden">

        <motion.video
          style={{ y: videoY }}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover z-[1] scale-105"
        >
          <source src="/herosec.mp4" type="video/mp4" />
        </motion.video>

        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-[#040405]/70 via-[#040405]/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#040405]/50 via-transparent to-transparent pointer-events-none" />

        <motion.div style={{ y: textY, opacity: textOp }}
          className="absolute z-10 bottom-16 left-8 sm:left-14 lg:left-20 flex flex-col items-start max-w-xl">
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col items-start">
            <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/70 mb-8 text-xs font-medium tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI-Powered Resume Analysis
            </motion.div>

            <motion.h1 variants={slideUp}
              className="text-5xl sm:text-6xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight text-white mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Upload.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#818CF8]">Analyze.</span><br />
              Get Hired.
            </motion.h1>

            <motion.p variants={slideUp} className="text-base md:text-lg text-white/50 mb-10 max-w-md leading-relaxed font-light">
              Upload your resume, pick your target company, and get a precise breakdown of exactly what you need to land the job.
            </motion.p>

            <motion.div variants={slideUp} className="flex flex-col sm:flex-row items-start gap-4">
              <Link to="/login">
                <button className="h-12 px-8 rounded-full bg-white text-[#0b0c10] text-sm font-semibold inline-flex items-center gap-2 hover:bg-white/90 transition-all duration-300 shadow-lg">
                  Analyze My Resume <ArrowUpRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/login">
                <button className="h-12 px-8 rounded-full border border-white/20 text-white/70 text-sm font-medium inline-flex items-center gap-2 hover:text-white hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
                  See How It Works
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 right-8 flex items-center gap-3 z-10">
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <span className="text-white/40 text-xs font-mono">Scroll down</span>
        </motion.div>
      </section>

      {/* ═══════════════════════ SHALLOW CURVED MARQUEE BRIDGE ═══════════════════════ */}
      <div className="relative z-[25] pointer-events-none w-full overflow-hidden" style={{ marginTop: '-90px', height: '300px' }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: '6000px', height: '6000px' }}>
          <div className="relative w-full h-full animate-[spin_120s_linear_infinite]">
            {Array(8).fill("200+ COMPANIES ✦ 98% ATS PASS RATE ✦ 40K+ RESUMES ANALYZED ✦ 3 SEC PARSE TIME ✦ ")
              .join("").split("").map((char, i, arr) => (
                <span
                  key={i}
                  className="absolute top-0 left-1/2 -translate-x-1/2"
                  style={{
                    height: '6000px',
                    transform: `rotate(${-(360 / arr.length) * i}deg)`,
                  }}
                >
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white/50 whitespace-pre drop-shadow-xl"
                    style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 900, fontSize: "44px", letterSpacing: "2px" }}>
                    {char}
                  </span>
                </span>
              ))}
          </div>
        </div>
      </div>


      {/* ═══════════════════════ FEATURES — EDITORIAL ═══════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* section label */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer} className="mb-20">
            <motion.p variants={slideUp}
              className="text-white/25 text-xs tracking-[0.4em] uppercase mb-3"
              style={{ fontFamily: "'Inter', sans-serif" }}>
              What we do
            </motion.p>
            <motion.div variants={slideUp} className="flex items-end gap-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Everything you need<br />to stand out
              </h2>
              <div className="hidden md:block mb-2 w-24 h-px bg-white/15" />
            </motion.div>
          </motion.div>

          {/* editorial layout: left nav + right panel */}
          <div
            className="flex flex-col md:flex-row gap-12 md:gap-20"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* left — numbered list nav */}
            <div className="md:w-72 flex-shrink-0 flex flex-col gap-px border-l border-white/8 pl-6">
              {FEATURES.map((f, i) => (
                <button
                  key={f.title}
                  onClick={() => { setActiveIdx(i); setPaused(true); }}
                  className="group text-left py-5 relative transition-all duration-300"
                >
                  {/* active indicator line */}
                  <div className={`absolute left-[-25px] top-0 bottom-0 w-px transition-all duration-500 ${i === activeIdx ? "bg-white" : "bg-transparent"
                    }`} />

                  <div className="flex items-start gap-4">
                    <span className={`text-xs font-mono mt-0.5 transition-colors duration-300 ${i === activeIdx ? "text-white/60" : "text-white/15"
                      }`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className={`text-sm font-medium leading-snug transition-colors duration-300 ${i === activeIdx ? "text-white" : "text-white/35 group-hover:text-white/60"
                        }`}
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {f.title}
                      </p>
                      {/* progress bar under active */}
                      {i === activeIdx && (
                        <div className="mt-2 h-px bg-white/10 w-full overflow-hidden">
                          <motion.div
                            key={activeIdx}
                            className="h-full bg-white/50"
                            initial={{ width: "0%" }}
                            animate={{ width: paused ? undefined : "100%" }}
                            transition={{ duration: 2, ease: "linear" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* right — feature panel */}
            <div className="flex-1 relative min-h-[340px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIdx}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full"
                >
                  {/* oversized ghost number */}
                  <div
                    className="absolute -top-8 -right-4 text-[160px] font-black leading-none select-none pointer-events-none"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "transparent",
                      WebkitTextStroke: "1px rgba(255,255,255,0.04)",
                    }}
                  >
                    {String(activeIdx + 1).padStart(2, "0")}
                  </div>

                  {/* glass panel */}
                  <div
                    className="relative rounded-2xl p-10 border border-white/8 overflow-hidden"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    {/* top accent line */}
                    <div className="absolute top-0 left-0 w-16 h-px bg-white/40" />
                    <div className="absolute top-0 left-0 w-4 h-px bg-white" />

                    {/* tag */}
                    <p className="text-white/30 text-[10px] tracking-[0.35em] uppercase mb-6"
                      style={{ fontFamily: "'Inter', sans-serif" }}>
                      {FEATURES[activeIdx].tag}
                    </p>

                    {/* title */}
                    <h3
                      className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {FEATURES[activeIdx].title}
                    </h3>

                    {/* thin divider */}
                    <div className="w-12 h-px bg-white/20 mb-6" />

                    {/* description */}
                    <p className="text-white/50 text-lg leading-relaxed max-w-xl"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
                      {FEATURES[activeIdx].desc}
                    </p>

                    {/* bottom-right nav arrows */}
                    <div className="absolute bottom-8 right-8 flex items-center gap-3">
                      <button
                        onClick={() => { setActiveIdx((p) => (p - 1 + FEATURES.length) % FEATURES.length); setPaused(true); }}
                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all duration-200"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                      </button>
                      <span className="text-white/15 text-xs font-mono">{String(activeIdx + 1).padStart(2, "0")} / {String(FEATURES.length).padStart(2, "0")}</span>
                      <button
                        onClick={() => { setActiveIdx((p) => (p + 1) % FEATURES.length); setPaused(true); }}
                        className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/30 transition-all duration-200"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ HOW IT WORKS (LUXURY DECRYPT) ═══════════════════════ */}
      <section ref={processRef} className="py-32 relative bg-[#040405] overflow-hidden">

        {/* Animated Gemini Generated Background Image */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], x: [0, 20, -20, 0], y: [0, -10, 10, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 z-0 opacity-20 mix-blend-lighten pointer-events-none"
          style={{
            backgroundImage: "url('/tech_bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* React Bits Squares Background Animation */}
        <Squares
          squareSize={60}
          borderColor="rgba(255,255,255,0.025)"
          hoverFillColor="rgba(255,255,255,0.06)"
          className="z-0"
        />

        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 pointer-events-none">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer} className="text-center mb-24 pointer-events-auto">
            <motion.p variants={slideUp} className="text-white/20 text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              The Process
            </motion.p>
            <ParallaxText offsetY={[80, -40]}>
              <motion.h2 variants={slideUp}
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                How it works
              </motion.h2>
            </ParallaxText>
            <motion.p variants={slideUp} className="text-white/40 max-w-xl mx-auto font-light text-lg">
              Three simple steps to knowing exactly where you stand — and how to close the gap.
            </motion.p>
          </motion.div>

          <motion.div style={{ filter: processBlur, opacity: processOpac }}
            className="grid md:grid-cols-3 gap-10 relative">

            {/* connecting luxury thread */}
            <div className="hidden md:block absolute top-[4rem] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />

            {[
              { step: "01", title: "UPLOAD RESUME", desc: "Drop your existing PDF or Word resume into the analyzer. No templates needed — just bring what you have.", color: "#38BDF8" },
              { step: "02", title: "TARGET COMPANY", desc: "Choose from a curated list of top companies across tech, finance, consulting, startups, and more.", color: "#F472B6" },
              { step: "03", title: "GAP REPORT", desc: "Get a precise breakdown of missing skills, recommended certifications, and actionable tips to make your resume shine.", color: "#34D399" },
            ].map((item, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredProcess(i)}
                onMouseLeave={() => setHoveredProcess(null)}
                className="relative z-10 flex flex-col group rounded-3xl overflow-hidden p-10 border border-white/5 transition-all duration-700 hover:border-white/20 hover:-translate-y-4 pointer-events-auto"
                style={{ background: "rgba(255,255,255,0.015)", backdropFilter: "blur(24px)", boxShadow: hoveredProcess === i ? `0 20px 80px rgba(0,0,0,0.5), 0 0 40px ${item.color}15` : "none" }}>

                {/* luxury step number */}
                <div className="mb-8 relative w-16 h-16 flex items-center justify-center rounded-2xl border border-white/10 group-hover:border-white/30 transition-colors duration-500" style={{ background: "rgba(255,255,255,0.03)" }}>
                  <span className="text-xl font-bold font-mono text-white/50 group-hover:text-white transition-colors duration-500">
                    {item.step}
                  </span>
                  {/* glow under icon */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[20px] -z-10" style={{ background: item.color }} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-5 transition-all duration-500"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  <DecryptedText text={item.title} isHovered={hoveredProcess === i} />
                </h3>

                <div className="w-10 h-px bg-white/20 mb-5 group-hover:w-full transition-all duration-700 ease-in-out" />

                <p className="text-white/40 text-base leading-relaxed font-light group-hover:text-white/60 transition-colors duration-500">
                  {item.desc}
                </p>

                {/* animated ambient corner glare */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-white opacity-0 group-hover:opacity-[0.02] transition-opacity duration-700 blur-2xl pointer-events-none" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════ ADVANCED PLATFORM (SPLIT LAYOUT + PIXEL TRANSITION) ═══════════════════════ */}
      <section className="py-32 relative bg-[#040405] overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

            {/* LEFT SIDE: TV CAROUSEL + SPOTLIGHT SHAPE BLUR + PIXEL TRANSITIONS */}
            <div className="relative w-full h-[550px]">
              <TVCarousel>
                <SpotlightCard className="h-[450px] p-0 border-white/10 overflow-hidden" spotlightColor="rgba(56, 189, 248, 0.2)">
                  <PixelTransition src="/feature_1.png" className="w-full h-full" />
                </SpotlightCard>

                <SpotlightCard className="h-[450px] p-0 border-white/10 overflow-hidden" spotlightColor="rgba(244, 114, 182, 0.2)">
                  <PixelTransition src="/feature_2.png" className="w-full h-full" />
                </SpotlightCard>

                <SpotlightCard className="h-[450px] p-0 border-white/10 overflow-hidden" spotlightColor="rgba(52, 211, 153, 0.2)">
                  <PixelTransition src="/feature_3.png" className="w-full h-full" />
                </SpotlightCard>
              </TVCarousel>
            </div>

            {/* RIGHT SIDE: INFORMATION TEXT */}
            <div className="flex flex-col relative z-10 w-full max-w-xl mx-auto lg:mx-0 lg:pl-10">

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer} className="mb-12">
                <motion.p variants={slideUp} className="text-[#34D399] text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Deep Insights
                </motion.p>
                <ParallaxText offsetY={[60, -50]}>
                  <motion.h2 variants={slideUp} className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Go beyond the surface
                  </motion.h2>
                </ParallaxText>
                <motion.p variants={slideUp} className="text-white/40 font-light text-lg">
                  Hover over the visual processors on the left to see our raw engine at work. Our advanced analysis doesn't just read words—it understands context, impact, and hiring psychology.
                </motion.p>
              </motion.div>

              <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer} className="space-y-6">
                {[
                  { title: "Semantic Keyword Matching", desc: "Moving past simple keyword stuffing, our engines analyze how you frame your experience to match true intent.", icon: <Target className="w-5 h-5 text-[#38BDF8]" />, color: "border-[#38BDF8]/20 bg-[#38BDF8]/5" },
                  { title: "Impact Quantifier", desc: "Automatically detects generic bullet points and injects exact formulas for measurable metrics that recruiters demand.", icon: <Shield className="w-5 h-5 text-[#F472B6]" />, color: "border-[#F472B6]/20 bg-[#F472B6]/5" },
                  { title: "Formatting Diagnostics", desc: "Instantly flags unreadable fonts, broken margins, and ATS-hostile layouts before they disqualify your application.", icon: <Cpu className="w-5 h-5 text-[#34D399]" />, color: "border-[#34D399]/20 bg-[#34D399]/5" },
                ].map((item, i) => (
                  <motion.div key={i} variants={slideUp}
                    className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/10 hover:bg-white/10">
                    <div className={`w-10 h-10 rounded-full flex shrink-0 items-center justify-center border shadow-inner ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════ CTA BANNER ═══════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* animated blobs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(56,189,248,0.15), transparent 70%)" }}
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(192,38,211,0.15), transparent 70%)" }}
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}>

            <motion.p variants={slideUp} className="text-[#C4A882] text-xs font-semibold tracking-[0.3em] uppercase mb-6">Get started today</motion.p>

            <ParallaxText offsetY={[90, -90]}>
              <motion.h2 variants={slideUp}
                className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Your dream job is<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#818CF8] to-[#C026D3]">
                  one upload away
                </span>
              </motion.h2>
            </ParallaxText>

            <motion.p variants={slideUp} className="text-white/40 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Join thousands of job seekers who've used BetterT to land roles at the world's best companies.
            </motion.p>

            <motion.div variants={slideUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-14 px-10 rounded-full text-[#0b0c10] font-bold text-base inline-flex items-center gap-2 shadow-2xl"
                  style={{ background: "linear-gradient(135deg, #38BDF8, #818CF8)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  Start for Free <ArrowUpRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-14 px-10 rounded-full border border-white/20 text-white/70 text-base font-medium hover:text-white hover:border-white/40 transition-all duration-300 backdrop-blur-sm">
                  Sign In
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
