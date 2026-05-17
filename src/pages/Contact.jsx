import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { motion } from "framer-motion";

export default function Contact() {
  const slideDown = {
    hidden: { opacity: 0, y: -30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.4 } }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradients */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.5 }} 
        className="absolute top-40 right-[10%] w-72 h-72 bg-[#D8C9AE]/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.5, delay: 0.5 }} 
        className="absolute bottom-10 left-[15%] w-80 h-80 bg-[#B08D8D]/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ show: { transition: { staggerChildren: 0.2 } } }}
          className="text-center mb-16"
        >
          <motion.p variants={slideDown} className="text-[#C4A882] text-xs font-semibold tracking-[0.3em] uppercase mb-4">Get in Touch</motion.p>
          <motion.h1 variants={slideDown} className="text-4xl md:text-5xl font-light text-white">We'd love to hear from you.</motion.h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 bg-[#1A1A1A]/40 backdrop-blur-sm border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Information & Image Side */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInLeft}
            className="relative p-10 lg:p-14 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[#141414]/80 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80" 
                alt="Corporate Office" 
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10 mb-12">
              <h2 className="text-2xl font-light text-white mb-4">Contact Information</h2>
              <p className="text-[#B0ACA5] font-light">
                Have questions about our resume builder or need enterprise solutions? Reach out to us.
              </p>
            </div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <Mail className="w-4 h-4 text-[#D8C9AE]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">Email Us</p>
                  <p className="text-[#B0ACA5] text-sm font-light">support@talentiqs.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <Phone className="w-4 h-4 text-[#D8C9AE]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">Call Us</p>
                  <p className="text-[#B0ACA5] text-sm font-light">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                  <MapPin className="w-4 h-4 text-[#D8C9AE]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">Office</p>
                  <p className="text-[#B0ACA5] text-sm font-light">
                    123 Innovation Drive<br />
                    Tech District, San Francisco<br />
                    CA 94105
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form Side */}
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInRight}
            className="p-10 lg:p-14"
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F5F0E8]">First Name</label>
                  <input 
                    type="text" 
                    placeholder="John"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D8C9AE]/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#F5F0E8]">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="Doe"
                    className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D8C9AE]/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5F0E8]">Email Address</label>
                <input 
                  type="email" 
                  placeholder="john@example.com"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D8C9AE]/50 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#F5F0E8]">Message</label>
                <textarea 
                  rows="4"
                  placeholder="How can we help you?"
                  className="w-full bg-[#141414] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#D8C9AE]/50 transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-[#D8C9AE] to-[#C4A882] text-[#141414] text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
