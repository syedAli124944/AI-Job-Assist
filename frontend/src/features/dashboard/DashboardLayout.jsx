import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Search,
  FileText,
  BookmarkCheck,
  Bell,
  LogOut,
  User,
  Menu,
  X,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { logout, getStoredUser, getUserDisplayName } from "../../lib/mockAuth";

import NotificationPopover from "../../components/shared/NotificationPopover";

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const storedUser = getStoredUser();
  const userName = getUserDisplayName();

  const user = {
    name: userName,
    email: storedUser?.email || "alex@example.com",
    role: "Senior Frontend Engineer",
    avatar: null,
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Find Jobs", path: "/jobs", icon: Search },
    { label: "Applications", path: "/applications", icon: BookmarkCheck },
    { label: "Cover Letters", path: "/cover-letter/job-001", icon: FileText },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col md:flex-row relative">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-cream border-r border-border min-h-screen p-6 sticky top-0 h-screen justify-between z-30">
        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 mb-8 px-2">
            <div className="w-8 h-8 bg-terracotta rounded-xl flex items-center justify-center shadow-xs">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <span className="font-fraunces font-semibold text-charcoal text-xl tracking-tight">
              AI JobAssist
            </span>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== "/dashboard" && location.pathname.startsWith(item.path));

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-terracotta text-white shadow-xs font-semibold"
                      : "text-warm-gray hover:text-charcoal hover:bg-sand/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-terracotta/15 text-terracotta font-semibold flex items-center justify-center text-sm border border-terracotta/20">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-charcoal truncate">{user.name}</p>
              <p className="text-xs text-warm-gray truncate">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs font-medium text-warm-gray hover:text-red-600 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-cream border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-terracotta rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <span className="font-fraunces font-semibold text-charcoal text-lg">AI JobAssist</span>
        </Link>
        <div className="flex items-center gap-3">
          <NotificationPopover />
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="text-charcoal p-1.5 rounded-lg hover:bg-sand"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-cream border-b border-border px-6 py-4 space-y-2 z-40"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-sm font-medium text-charcoal hover:text-terracotta"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
            <div className="pt-3 border-t border-border mt-2 flex items-center justify-between">
              <span className="text-xs text-warm-gray">{user.name}</span>
              <button onClick={handleLogout} className="text-xs text-red-600 font-medium">
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full relative">
        {/* Top-Right Notification Widget for Desktop */}
        <div className="hidden md:block absolute top-6 right-1 z-40">
          <NotificationPopover />
        </div>

        {children}
      </main>
    </div>
  );
}
