import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { isAuthenticated, getStoredUser, getUserDisplayName, logout } from "../../lib/mockAuth";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const displayName = getUserDisplayName();

  const handleDashboardClick = () => {
    const hasCompletedOnboarding = localStorage.getItem("onboarding_complete") === "true" || localStorage.getItem("user_resume");
    if (hasCompletedOnboarding) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur-sm shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <span className="font-fraunces font-semibold text-charcoal text-lg">JobAssist</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={handleDashboardClick}
            className="text-sm text-charcoal font-bold hover:text-terracotta transition-colors"
          >
            Dashboard
          </button>
          <a href="#features" className="text-sm font-bold text-warm-gray hover:text-charcoal transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-bold text-warm-gray hover:text-charcoal transition-colors">How it works</a>
          <a href="#stats" className="text-sm font-bold text-warm-gray hover:text-charcoal transition-colors">Stats</a>
        </nav>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-white tracking-wide lowercase bg-[linear-gradient(90deg,#B4654A,#954F39,#7B5A39,#A77123,#91724F)] animate-gradient-luxury px-3.5 py-1.5 rounded-xl shadow-xs border border-white/25 hover:scale-105 transition-all duration-200 cursor-default select-none inline-flex items-center gap-2 transform-gpu antialiased">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-xs" />
                hi, {displayName.toLowerCase()}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:shadow-md transition-all duration-200"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="text-sm font-bold text-charcoal hover:text-terracotta transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/onboarding"
                className="bg-terracotta text-white text-sm font-bold px-5 py-2 rounded-xl hover:bg-terracotta-dark transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-charcoal"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 bg-charcoal mb-1 transition-transform ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`} />
          <div className={`w-5 h-0.5 bg-charcoal mb-1 transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <div className={`w-5 h-0.5 bg-charcoal transition-transform ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-cream border-t border-border px-6 py-4 flex flex-col gap-4"
        >
          <button
            onClick={() => {
              setMobileOpen(false);
              handleDashboardClick();
            }}
            className="text-sm font-bold text-charcoal text-left"
          >
            Dashboard
          </button>
          <a href="#features" className="text-sm font-bold text-warm-gray" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#how-it-works" className="text-sm font-bold text-warm-gray" onClick={() => setMobileOpen(false)}>How it works</a>
          {loggedIn ? (
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <span className="text-xs font-bold text-white tracking-wide lowercase bg-[linear-gradient(90deg,#B5654A,#954F39,#6B5B49,#D97706,#B5654A)] animate-gradient-luxury px-3.5 py-1.5 rounded-xl shadow-xs border border-white/25 inline-flex items-center gap-2 transform-gpu antialiased w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-xs" />
                hi, {displayName.toLowerCase()}
              </span>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 text-xs font-bold px-5 py-2.5 rounded-xl text-center shadow-xs transition-all duration-200"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <Link to="/auth/login" className="text-sm font-medium text-charcoal" onClick={() => setMobileOpen(false)}>Sign in</Link>
              <Link to="/onboarding" className="bg-terracotta text-white text-sm font-medium px-5 py-2.5 rounded-xl text-center" onClick={() => setMobileOpen(false)}>Get started</Link>
            </>
          )}
        </motion.div>
      )}
    </motion.header>
  );
}
