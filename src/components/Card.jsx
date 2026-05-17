export default function Card({ children, className = "", padding = "p-6" }) {
  return (
    <div className={`futuristic-card glass-panel rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_12px_40px_rgba(216,201,174,0.15)] hover:border-[#D8C9AE]/25 ${padding} ${className}`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D8C9AE]/10 via-[#8B7355]/5 to-transparent rounded-bl-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#B08D8D]/8 to-transparent rounded-tr-full pointer-events-none"></div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
