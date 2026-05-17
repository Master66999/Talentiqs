export default function Button({ children, variant = "primary", className = "", ...props }) {
  const baseStyle = "inline-flex items-center justify-center px-5 py-2.5 font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D8C9AE]/30 focus:ring-offset-2 focus:ring-offset-[#141414]";
  
  const variants = {
    primary: "neon-button font-semibold tracking-wide text-sm",
    secondary: "glass-panel-light text-[#D8C9AE] hover:bg-[#D8C9AE]/10 hover:text-[#F5F0E8] hover:border-[#D8C9AE]/30 transition-all duration-300",
    ghost: "bg-transparent text-[#B0ACA5] hover:bg-white/5 hover:text-[#D8C9AE]",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
