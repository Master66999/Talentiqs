import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TVCarousel({ children }) {
  const items = React.Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex(c => (c === 0 ? items.length - 1 : c - 1));
  const next = () => setCurrentIndex(c => (c === items.length - 1 ? 0 : c + 1));

  return (
    <div className="relative w-full max-w-6xl mx-auto h-[550px] flex items-center justify-center overflow-hidden" style={{ perspective: "1200px" }}>
      
      <div className="relative w-full h-full flex items-center justify-center transform-gpu">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((child, index) => {
            let offset = index - currentIndex;
            // Handle edge wrap-arounds for seamless infinite looping
            if (offset < -1 && currentIndex === items.length - 1 && index === 0) offset = 1;
            if (offset > 1 && currentIndex === 0 && index === items.length - 1) offset = -1;

            if (Math.abs(offset) > 1) return null;

            const isCenter = offset === 0;
            const xOffset = offset * 340; 
            const zOffset = Math.abs(offset) * -250; 
            const rotateY = offset * -35; 
            const scale = isCenter ? 1 : 0.85;
            const opacity = isCenter ? 1 : 0.3;
            const blur = isCenter ? 0 : 12;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, x: offset > 0 ? 500 : -500 }}
                animate={{
                  x: xOffset,
                  z: zOffset,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  filter: `blur(${blur}px)`,
                  zIndex: isCenter ? 20 : 10
                }}
                exit={{ opacity: 0, scale: 0.8, x: offset > 0 ? 500 : -500 }}
                transition={{ type: "spring", stiffness: 220, damping: 25 }}
                className="absolute w-[360px] md:w-[480px] max-w-[90vw]"
                onClick={() => {
                  if (offset === -1) prev();
                  if (offset === 1) next();
                }}
                style={{ 
                  cursor: isCenter ? 'default' : 'pointer', 
                  transformStyle: "preserve-3d" 
                }}
              >
                <div className={`w-full h-full transition-all duration-300 ${!isCenter ? 'pointer-events-none' : ''}`}>
                  {child}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <button 
        onClick={prev} 
        className="absolute left-0 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all backdrop-blur-xl z-30"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={next} 
        className="absolute right-0 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all backdrop-blur-xl z-30"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Progress Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30 bg-black/40 px-4 py-2 rounded-full backdrop-blur-xl border border-white/10">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`transition-all duration-300 rounded-full h-2 ${currentIndex === idx ? "w-8 bg-white" : "w-2 bg-white/30 hover:bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
}
