import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function About() {
  const textStagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradients */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 2 }} 
        className="absolute top-32 left-[10%] w-72 h-72 bg-[#D8C9AE]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 2, delay: 0.5 }} 
        className="absolute bottom-20 right-[15%] w-64 h-64 bg-[#B08D8D]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative group rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-auto lg:h-[600px] border border-white/10 shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-60 z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
              alt="Team collaborating" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          </motion.div>

          {/* Information Side */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={textStagger}
            className="flex flex-col justify-center"
          >
            <motion.p variants={slideUp} className="text-[#C4A882] text-xs font-semibold tracking-[0.3em] uppercase mb-4">Our Story</motion.p>
            <motion.h1 variants={slideUp} className="text-4xl md:text-5xl font-light text-white mb-6">Helping you land the job through intelligent resume analysis.</motion.h1>
            
            <div className="space-y-6 text-[#B0ACA5] font-light leading-relaxed">
              <motion.p variants={slideUp}>
                At Talentiqs, we believe the gap between a talented person and their dream job is usually just information. We built this platform so candidates know precisely what skills, certifications, and experiences their target company is looking for before they apply.
              </motion.p>
              <motion.p variants={slideUp}>
                Founded by professionals who have both hired and been hired at top-tier firms, we understand what recruiters actually scan for — and we've built tools that translate those insights directly to you.
              </motion.p>
              <motion.p variants={slideUp}>
                Whether you're targeting Google, a fast-growing startup, or a financial institution, Talentiqs gives you a targeted, company-specific gap report so you stop guessing and start improving.
              </motion.p>
            </div>

            <motion.div variants={slideUp} className="mt-12 flex items-center gap-6">
              <div className="border-l border-[#D8C9AE]/30 pl-6">
                <h3 className="text-3xl font-light text-white mb-1">10k+</h3>
                <p className="text-xs text-[#C4A882] tracking-wider uppercase">Resumes Analyzed</p>
              </div>
              <div className="border-l border-[#D8C9AE]/30 pl-6">
                <h3 className="text-3xl font-light text-white mb-1">200+</h3>
                <p className="text-xs text-[#C4A882] tracking-wider uppercase">Companies Profiled</p>
              </div>
            </motion.div>

            <motion.div variants={slideUp} className="mt-12">
              <Link to="/login">
                <button className="h-12 px-8 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/10 hover:border-white/25 transition-all duration-300">
                  Analyze My Resume
                </button>
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
