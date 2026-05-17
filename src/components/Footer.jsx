import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Github, Twitter, Linkedin, Mail } from "lucide-react";

const LINKS = {
  Product: [
    { label: "Features", to: "/features" },
    { label: "Pricing", to: "/pricing" },
    { label: "How It Works", to: "/#how-it-works" },
    { label: "AI Career Builder", to: "/ai-career" },
  ],
  Company: [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Privacy Policy", to: "#" },
    { label: "Terms of Service", to: "#" },
  ],
  Resources: [
    { label: "IT Dashboard", to: "/dashboard/it" },
    { label: "Non-IT Dashboard", to: "/dashboard/non-it" },
    { label: "ATS Tips", to: "#" },
    { label: "Resume Guide", to: "#" },
  ],
};

const SOCIALS = [
  { icon: <Twitter className="w-4 h-4" />, href: "#", label: "Twitter" },
  { icon: <Linkedin className="w-4 h-4" />, href: "#", label: "LinkedIn" },
  { icon: <Github className="w-4 h-4" />, href: "#", label: "GitHub" },
  { icon: <Mail className="w-4 h-4" />, href: "#", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5"
      style={{ background: "#040405", fontFamily: "'Inter', sans-serif" }}>

      {/* ambient glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(56,189,248,0.06) 0%, transparent 70%)" }} />

      {/* top CTA strip */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-2">Ready to level up?</p>
            <h3 className="text-2xl md:text-3xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Analyze your resume{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#818CF8]">
                for free
              </span>
            </h3>
          </div>
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 h-12 px-8 rounded-full font-semibold text-sm text-[#040405] inline-flex items-center gap-2 shadow-lg"
              style={{ background: "linear-gradient(135deg, #38BDF8, #818CF8)" }}>
              Get Started <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>

      {/* main footer body */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">

          {/* brand column */}
          <div className="col-span-2 md:col-span-1">
            {/* logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#818CF8] flex items-center justify-center font-bold text-white text-sm shadow-lg">
                T
              </div>
              <span className="font-bold text-lg text-white tracking-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Better<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#818CF8]">T</span>
              </span>
            </Link>

            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-[220px]">
              AI-powered resume analysis matched to the company you actually want to work at.
            </p>

            {/* socials */}
            <div className="flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all duration-200"
                  style={{ backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.03)" }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <p className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}
                      className="text-white/40 text-sm hover:text-white transition-colors duration-200 hover:translate-x-0.5 inline-block hover:transition-transform">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} BetterT. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-white/20 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
