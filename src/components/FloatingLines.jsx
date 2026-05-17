import { useRef, useEffect, useCallback } from "react";

export default function FloatingLines({
  linesGradient = ["#7e8b91", "#654858", "#67464e"],
  animationSpeed = 1,
  interactive = true,
  bendRadius = 14,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });
  const linesRef = useRef([]);
  const animRef = useRef(null);
  const timeRef = useRef(0);

  const createLines = useCallback(
    (width, height) => {
      const lines = [];
      const lineCount = 18;
      for (let i = 0; i < lineCount; i++) {
        const points = [];
        const y = (height / (lineCount + 1)) * (i + 1);
        const segCount = 60;
        for (let j = 0; j <= segCount; j++) {
          points.push({
            x: (width / segCount) * j,
            baseY: y,
            y: y,
            vx: 0,
            vy: 0,
          });
        }
        lines.push({
          points,
          colorIndex: i % linesGradient.length,
          phase: Math.random() * Math.PI * 2,
          amplitude: 8 + Math.random() * 15,
          frequency: 0.01 + Math.random() * 0.015,
          speed: (0.3 + Math.random() * 0.7) * animationSpeed,
          opacity: 0.25 + Math.random() * 0.35,
          width: 1 + Math.random() * 1.5,
        });
      }
      return lines;
    },
    [linesGradient, animationSpeed]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      linesRef.current = createLines(width, height);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    if (interactive) {
      canvas.addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
    }

    const animate = () => {
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse tracking
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * mouseDamping;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * mouseDamping;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      linesRef.current.forEach((line) => {
        const t = timeRef.current * line.speed;

        line.points.forEach((pt, j) => {
          // Base wave motion
          let waveY =
            Math.sin(pt.x * line.frequency + t + line.phase) * line.amplitude;

          if (parallax) {
            waveY += Math.sin(pt.x * 0.003 + t * 0.5) * line.amplitude * parallaxStrength;
          }

          // Mouse interaction
          if (interactive && mx > -500) {
            const dx = pt.x - mx;
            const dy = pt.baseY + waveY - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = bendRadius * 15;
            if (dist < radius) {
              const factor = (1 - dist / radius) * bendStrength * 80;
              waveY += (dy / (dist || 1)) * factor;
            }
          }

          pt.y = pt.baseY + waveY;
        });

        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = linesGradient[line.colorIndex];
        ctx.globalAlpha = line.opacity;
        ctx.lineWidth = line.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        const pts = line.points;
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const cx = (pts[i].x + pts[i + 1].x) / 2;
          const cy = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, cx, cy);
        }
        const last = pts[pts.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      if (interactive) {
        canvas.removeEventListener("mousemove", handleMouseMove);
        canvas.removeEventListener("mouseleave", handleMouseLeave);
      }
      cancelAnimationFrame(animRef.current);
    };
  }, [createLines, interactive, bendRadius, bendStrength, mouseDamping, parallax, parallaxStrength, linesGradient]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: interactive ? "auto" : "none",
      }}
    />
  );
}
