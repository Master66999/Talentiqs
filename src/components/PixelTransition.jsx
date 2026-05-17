import React, { useRef, useEffect, useState } from 'react';

export default function PixelTransition({ src, className = "" }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const requestRef = useRef(null);
  const pixelSizeRef = useRef(1); // 1 = normal, higher = more pixelated
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // We create and cache an image element
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      hasLoadedRef.current = true;
      if (containerRef.current) {
        resizeCanvas();
        draw(img);
      }
    };

    const resizeCanvas = () => {
      if (!containerRef.current || !canvas) return;
      canvas.width = containerRef.current.offsetWidth;
      canvas.height = containerRef.current.offsetHeight;
      if (hasLoadedRef.current) draw(img);
    };

    const draw = (imageObj) => {
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false; // The secret to sharp pixelation

      const imgRatio = imageObj.width / imageObj.height;
      const canvasRatio = canvas.width / canvas.height;
      
      let drawWidth = canvas.width;
      let drawHeight = canvas.height;
      let offsetX = 0;
      let offsetY = 0;

      // Cover logic
      if (imgRatio > canvasRatio) {
        drawWidth = canvas.height * imgRatio;
        offsetX = (canvas.width - drawWidth) / 2;
      } else {
        drawHeight = canvas.width / imgRatio;
        offsetY = (canvas.height - drawHeight) / 2;
      }

      const currentPixelSize = Math.floor(pixelSizeRef.current);

      if (currentPixelSize <= 1) {
         ctx.drawImage(imageObj, offsetX, offsetY, drawWidth, drawHeight);
         return;
      }

      // To pixelate we draw a tiny version of the image offscreen, then scale it back up
      const scaledW = Math.max(1, Math.floor(canvas.width / currentPixelSize));
      const scaledH = Math.max(1, Math.floor(canvas.height / currentPixelSize));
      
      const offscreen = document.createElement('canvas');
      offscreen.width = scaledW;
      offscreen.height = scaledH;
      const offCtx = offscreen.getContext('2d');
      offCtx.imageSmoothingEnabled = false;
      
      offCtx.drawImage(imageObj, offsetX / currentPixelSize, offsetY / currentPixelSize, drawWidth / currentPixelSize, drawHeight / currentPixelSize);
      
      ctx.drawImage(offscreen, 0, 0, scaledW, scaledH, 0, 0, canvas.width, canvas.height);
    };

    // Animation Loop
    const animate = () => {
      const target = isHovered ? 30 : 1; // Block size goes up to 30px on hover
      const diff = target - pixelSizeRef.current;
      
      if (Math.abs(diff) < 0.5) {
        pixelSizeRef.current = target;
        if (hasLoadedRef.current) draw(img);
        return; // stop loop
      }

      pixelSizeRef.current += diff * 0.15; // Smooth exponential easing
      if (hasLoadedRef.current) draw(img);
      
      requestRef.current = requestAnimationFrame(animate);
    };

    // Trigger animation when hover state changes
    cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(animate);

    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (containerRef.current) resizeObserver.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(requestRef.current);
      resizeObserver.disconnect();
    };
  }, [src, isHovered]);

  return (
    <div 
       ref={containerRef} 
       className={`relative overflow-hidden w-full h-full cursor-pointer transition-transform duration-700 ${className}`}
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)}
       style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
    >
       <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
       {/* Optional color overlay when unpixelated */}
       <div className={`absolute inset-0 bg-[#040405]/20 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  );
}
