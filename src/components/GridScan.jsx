export default function GridScan({
  sensitivity = 0.55,
  lineThickness = 1,
  linesColor = "#616062",
  scanColor = "#a998a9",
  scanOpacity = 0.4,
  gridScale = 0.1,
  lineStyle = "solid",
  lineJitter = 0.1,
  scanDirection = "pingpong",
  noiseIntensity = 0.01,
  scanGlow = 0.5,
  scanSoftness = 2,
  scanDuration = 2,
  scanDelay = 2,
  scanOnClick = false,
}) {
  // Translate gridScale (0.1) into a reasonable pixel value for CSS background.
  // 0.1 might mean 10% or just a small scale. Let's use 60px as a baseline grid size.
  const cellSize = Math.max(20, gridScale * 400); 

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none w-full h-full z-0">
      
      {/* ─── The Grid ─── */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${linesColor} ${lineThickness}px, transparent ${lineThickness}px),
            linear-gradient(to bottom, ${linesColor} ${lineThickness}px, transparent ${lineThickness}px)
          `,
          backgroundSize: `${cellSize}px ${cellSize}px`,
          opacity: 0.35 // Increased base opacity to be visible over black
        }}
      />

      {/* ─── The Scanning Beam ─── */}
      <div
        className="absolute left-0 w-full"
        style={{
          height: `${scanSoftness * 15}%`,
          background: `linear-gradient(to bottom, transparent, ${scanColor}, transparent)`,
          opacity: scanOpacity * 1.5, // Boosted opacity for visibility
          boxShadow: `0 0 ${scanGlow * 30}px ${scanColor}`, // Glow effect
          animation: `scanAnim ${scanDuration + scanDelay}s cubic-bezier(0.4, 0, 0.2, 1) infinite ${scanDirection === "pingpong" ? "alternate" : "normal"}`
        }}
      />

      <style>{`
        @keyframes scanAnim {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}
