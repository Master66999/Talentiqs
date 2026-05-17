import React, { useRef, useState, useEffect } from 'react';

const Squares = ({ 
  direction = "diagonal",
  speed = 40,
  squareSize = 40, 
  borderColor = "rgba(255,255,255,0.02)", 
  hoverFillColor = "rgba(255,255,255,0.06)",
  className = "" 
}) => {
  const [hoveredSquare, setHoveredSquare] = useState(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        // Render enough squares to cover screen + an extra row/col to allow seamless scrolling
        setDimensions({
          width: containerRef.current.offsetWidth + squareSize * 2,
          height: containerRef.current.offsetHeight + squareSize * 2
        });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [squareSize]);

  // Using a fixed max grid to avoid thousands of DOM nodes on massive screens 
  // (adjust squareSize to be larger if performance suffers)
  const cols = Math.max(1, Math.ceil(dimensions.width / squareSize));
  const rows = Math.max(1, Math.ceil(dimensions.height / squareSize));
  const totalSquares = cols * rows;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-auto ${className}`}>
      
      {/* Container that pans the grid slowly */}
      <div 
        ref={containerRef}
        className="absolute inset-[-40px] w-[calc(100%+80px)] h-[calc(100%+80px)]"
      >
        {dimensions.width > 0 && (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: `repeat(${cols}, 1fr)`, 
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              width: `${cols * squareSize}px`,
              height: `${rows * squareSize}px`,
            }}
            onMouseLeave={() => setHoveredSquare(null)}
          >
            {[...Array(totalSquares)].map((_, i) => (
              <div 
                key={i}
                onMouseEnter={() => setHoveredSquare(i)}
                className="w-full h-full border-r border-b transition-colors duration-1000 ease-out hover:duration-0"
                style={{
                  borderColor: borderColor,
                  backgroundColor: hoveredSquare === i ? hoverFillColor : 'transparent'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fade edges to deep black to merge seamlessly with the site background */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#040405] via-transparent to-[#040405] z-0" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#040405] via-transparent to-[#040405] z-0" />
      <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: "radial-gradient(ellipse at center, transparent 40%, #040405 90%)" }} />
      
    </div>
  );
};

export default Squares;
