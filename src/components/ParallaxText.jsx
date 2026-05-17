import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxText({ 
  children, 
  className = "", 
  offsetY = [100, -100], 
  smoothness = 0.5 
}) {
  const ref = useRef(null);
  
  // Track this specific element's position in the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Map the scroll progress (0 to 1) to the desired Y translation
  const y = useTransform(scrollYProgress, [0, 1], offsetY);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);

  return (
    <motion.div 
      ref={ref} 
      style={{ y, opacity }} 
      className={className}
      transition={{ ease: [0.22, 1, 0.36, 1], duration: smoothness }}
    >
      {children}
    </motion.div>
  );
}
