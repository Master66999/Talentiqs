import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 z-50 bg-[#141414]/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-bold text-lg text-[#F5F0E8] tracking-tight">
            Talenti<span className="text-[#D8C9AE]">qs</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        {!isAuthPage && (
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={`text-[13px] transition-colors duration-300 ${location.pathname === "/" ? "text-white" : "text-[#B0ACA5] hover:text-white"}`}>Home</Link>
            <Link to="/about" className={`text-[13px] transition-colors duration-300 ${location.pathname === "/about" ? "text-white" : "text-[#B0ACA5] hover:text-white"}`}>About</Link>
            <Link to="/features" className={`text-[13px] transition-colors duration-300 ${location.pathname === "/features" ? "text-white" : "text-[#B0ACA5] hover:text-white"}`}>Features</Link>
            <Link to="/pricing" className={`text-[13px] transition-colors duration-300 ${location.pathname === "/pricing" ? "text-white" : "text-[#B0ACA5] hover:text-white"}`}>Pricing</Link>
            <Link to="/contact" className={`text-[13px] transition-colors duration-300 ${location.pathname === "/contact" ? "text-white" : "text-[#B0ACA5] hover:text-white"}`}>Contact</Link>
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {!isAuthPage && user ? (
            <>
              <Link to="/category" className="text-[13px] text-[#B0ACA5] hover:text-white transition-colors duration-300">
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D8C9AE] to-[#8B7355] flex items-center justify-center text-[#141414] text-xs font-bold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="text-[13px] font-medium text-[#F5F0E8]">{user.name || "User"}</span>
              </div>
              <button
                onClick={logout}
                className="text-[13px] text-[#B08D8D] hover:text-[#D4A0A0] transition-colors duration-300"
              >
                Logout
              </button>
            </>
          ) : !isAuthPage ? (
            <>
              <Link to="/login" className="text-[13px] text-[#B0ACA5] hover:text-white transition-colors duration-300">
                Log in
              </Link>
              <Link to="/login" className="text-[13px] font-medium px-4 py-1.5 rounded-full border border-white/15 text-[#F5F0E8] hover:bg-white/5 hover:border-white/25 transition-all duration-300">
                Create Account
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
