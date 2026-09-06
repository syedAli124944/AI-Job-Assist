import { Link } from "react-router-dom";
import { Briefcase, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/70 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-terracotta rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              <span className="font-fraunces font-semibold text-white text-lg">JobAssist</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Your AI-powered career concierge. Find jobs, craft cover letters, and track applications — all in one place.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Github size={18} /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
              <li><Link to="/auth/register" className="hover:text-white transition-colors">Get started</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} JobAssist. All rights reserved.</p>
          <p>Made with ❤️ for job seekers everywhere</p>
        </div>
      </div>
    </footer>
  );
}
