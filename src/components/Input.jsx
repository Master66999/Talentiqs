import { forwardRef } from "react";

const Input = forwardRef(({ label, id, error, className = "", ...props }, ref) => {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[#C4A882]">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`px-4 py-2.5 glass-panel-light text-[#F5F0E8] placeholder-[#8B7355]/60 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D8C9AE]/30 focus:border-[#D8C9AE]/40 ${
          error ? "border-[#B08D8D]" : "hover:border-[#D8C9AE]/20"
        }`}
        {...props}
      />
      {error && <p className="text-xs text-[#B08D8D]">{error}</p>}
    </div>
  );
});

Input.displayName = "Input";
export default Input;
