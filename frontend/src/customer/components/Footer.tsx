import React from "react";
import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      {/* Top Banner section */}
      <div className="bg-slate-800 text-center py-4">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-sm font-semibold hover:text-white transition-colors duration-200 focus:outline-none"
        >
          Back to top
        </button>
      </div>

      {/* Main footer contents */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1 */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Get to Know Us</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Press Releases</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Inba Mart Science</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Connect with Us</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <FacebookIcon sx={{ fontSize: 16 }} />
                <a href="#" className="hover:text-teal-400 transition-colors">Facebook</a>
              </li>
              <li className="flex items-center gap-2">
                <TwitterIcon sx={{ fontSize: 16 }} />
                <a href="#" className="hover:text-teal-400 transition-colors">Twitter</a>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon sx={{ fontSize: 16 }} />
                <a href="#" className="hover:text-teal-400 transition-colors">Instagram</a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Let Us Help You</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/profile" className="hover:text-teal-400 transition-colors">Your Account</Link></li>
              <li><Link to="/my-orders" className="hover:text-teal-400 transition-colors">Returns Centre</Link></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Recalls & Product Safety</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Help</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">Policy & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-teal-400 transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Notice</a></li>
            </ul>
          </div>
        </div>

        <hr className="border-slate-800 my-8" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex items-center">
            <div className="bg-white px-2.5 py-1.25 rounded-lg border border-slate-700 flex items-center justify-center shadow-md">
              <img src="/inbamart-logo.png" alt="Inba Mart" className="h-6 w-auto object-contain" />
            </div>
          </div>

          {/* Copyright */}
          <div>
            <p className="text-slate-500 font-medium">
              &copy; 2026, Inba Mart or its affiliates. All rights reserved.
            </p>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="text-slate-600 font-bold">100% Safe Payments</span>
            <div className="flex gap-2">
              <span className="bg-slate-800 text-[10px] text-slate-300 px-2 py-0.5 rounded font-extrabold tracking-wider">VISA</span>
              <span className="bg-slate-800 text-[10px] text-slate-300 px-2 py-0.5 rounded font-extrabold tracking-wider">MC</span>
              <span className="bg-slate-800 text-[10px] text-slate-300 px-2 py-0.5 rounded font-extrabold tracking-wider">RUPAY</span>
              <span className="bg-slate-800 text-[10px] text-slate-300 px-2 py-0.5 rounded font-extrabold tracking-wider">UPI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
