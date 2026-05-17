import Card from "../components/Card";
import { Upload, Target, Sparkles, BadgeCheck, Shield, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      icon: Upload,
      title: "Resume Upload & Parsing",
      desc: "Upload your resume in PDF or Word format. Our parser instantly extracts your skills, experience, education, and certifications for analysis.",
      accent: "#D8C9AE",
    },
    {
      icon: Target,
      title: "Company-Specific Targeting",
      desc: "Select from top companies — Google, Amazon, Microsoft, JPMorgan, McKinsey, and more. Every analysis is custom-tailored to that company's hiring bar.",
      accent: "#C4A882",
    },
    {
      icon: Sparkles,
      title: "AI Gap Analysis",
      desc: "Our AI highlights exactly what's missing from your resume compared to what your target company actually looks for in candidates.",
      accent: "#B08D8D",
    },
    {
      icon: BadgeCheck,
      title: "Certification Recommendations",
      desc: "Get a curated list of certifications and courses that will make you a dramatically stronger candidate for your specific target role.",
      accent: "#D8C9AE",
    },
    {
      icon: TrendingUp,
      title: "Actionable Improvement Tips",
      desc: "Receive prioritized, concrete improvement suggestions — from rewording bullet points to adding missing projects that hiring managers want to see.",
      accent: "#C4A882",
    },
    {
      icon: Shield,
      title: "Privacy First",
      desc: "Your resume data is never shared. You control what gets analyzed and for how long it's stored. Full transparency, always.",
      accent: "#B08D8D",
    },
  ];

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Animated Background Image - Parallax */}
      <div className="absolute inset-0 z-0 opacity-10 [clip-path:inset(0)]">
        <div className="fixed inset-0 z-0">
          <motion.img 
            initial={{ scale: 1 }}
            animate={{ scale: 1.15 }}
            transition={{ duration: 40, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Cyber Security Tech Mesh" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#141414] via-[#141414]/40 to-[#141414] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.5 }} 
        className="absolute top-32 left-[10%] w-72 h-72 bg-[#D8C9AE]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.5, delay: 0.5 }} 
        className="absolute bottom-20 right-[15%] w-64 h-64 bg-[#B08D8D]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.p variants={slideUp} className="text-[#C4A882] text-xs font-semibold tracking-[0.3em] uppercase mb-4">What we offer</motion.p>
          <motion.h1 variants={slideUp} className="text-4xl md:text-5xl font-light text-white mb-5">Powerful analysis, clear results</motion.h1>
          <motion.p variants={slideUp} className="text-[#B0ACA5] max-w-xl mx-auto font-light">Everything you need to understand exactly how to tailor your resume and land your target role.</motion.p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((item, i) => (
            <motion.div variants={slideUp} key={i}>
              <Card className="group hover:-translate-y-1 transition-all duration-500 h-full">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 border border-white/10 group-hover:border-transparent"
                  style={{ backgroundColor: `${item.accent}15`, color: item.accent }}
                >
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-[#F5F0E8] mb-3">{item.title}</h3>
                <p className="text-[#B0ACA5] leading-relaxed text-sm font-light">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link to="/login">
            <button className="h-12 px-8 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/10 hover:border-white/25 transition-all duration-300">
              Analyze My Resume →
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
