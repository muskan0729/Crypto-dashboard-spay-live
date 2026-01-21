import { useState, useEffect, useRef } from "react"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import useAutoFetch from "../hooks/useAutoFetch";
import { useGet } from "../hooks/useGet";
import "../css/header.css";
import CryptoAmount from "./CryptoAmounts";

export const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { execute: logout } = usePost("/logout");
  const { data } = useAutoFetch("/collection-record");
  const { data: merchantData } = useGet("/show-merchant");

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [activeStat, setActiveStat] = useState(null);
  const [role] = useState(atob(localStorage.getItem("role")));

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userStats = [
    {
      id: 3,
      icon: "fa-solid fa-wallet",
      label: "Payout Wallet",
      value: Number(data?.payout_wallet ?? 0).toFixed(8),
    },
    {
      id: 4,
      icon: "fa-solid fa-wallet",
      label: "Payin Wallet",
      value: Number(data?.PayingAmount ?? 0).toFixed(8),
    },
  ];

  const cryptoStats = [
    {
      id: 101,
      icon: "fa-brands fa-bitcoin",
      label: "Crypto Wallet",
      value: Number(data?.total_crypto ?? 0).toFixed(8),
    },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <nav className="relative w-full z-30">
      {/* Cinematic Glow Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/70 via-[#0a0a0a]/70 to-black/70 backdrop-blur-sm" />

      <div className="relative flex items-center justify-between px-4 py-3
                      bg-black/80 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.2)]
                      rounded-b-2xl transition-all duration-300">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="md:hidden text-2xl text-cyan-400 hover:text-cyan-300 transition-transform transform hover:scale-110"
          >
            ☰
          </button>

          {/* Desktop Stats */}
          {role !== "admin" && (
            <div className="hidden md:flex items-center gap-4 text-sm">
              {(role === "crypto" ? cryptoStats : userStats).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl
                             bg-white/5 border border-cyan-500/20
                             backdrop-blur-lg shadow-[0_0_10px_rgba(0,255,255,0.2)]
                             transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_15px_rgba(0,255,255,0.4)]"
                >
                  <i className={`${item.icon} fa-lg text-cyan-400`} />
                  <span className="text-white/70 tracking-wider">{item.label}:</span>
                  <span className="font-semibold text-white tracking-wide">
                    <CryptoAmount amount={item.value} symbol="₹" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT / PROFILE */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center focus:outline-none"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRduYoJopcD2_WmDjt978P3pjTLl-oQX-ZsTOaof805POhNgFzpYEy5LnA&s"
              alt="profile"
              className="w-10 h-10 rounded-full border border-cyan-500/30 shadow-[0_0_10px_rgba(0,255,255,0.3)]
                         transition-all duration-300 hover:shadow-[0_0_15px_rgba(0,255,255,0.6)] hover:scale-105"
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-64 p-4 rounded-2xl
                            bg-black/50 backdrop-blur-xl border border-cyan-500/20
                            shadow-[0_0_20px_rgba(0,255,255,0.4)]
                            transition-all duration-300 z-50">
              <div className="text-center mb-4">
                <h6 className="font-semibold text-cyan-400 tracking-wide">
                  {merchantData?.data?.name || "Admin"}
                </h6>
                <p className="text-white/60 text-sm tracking-wider">
                  {merchantData?.data?.email}
                </p>
              </div>

              <hr className="border-cyan-500/20 mb-3" />

              {role !== "admin" && (
                <Link
                  to="/profile"
                  className="block px-4 py-2 rounded-lg text-white/80 hover:text-white hover:bg-cyan-500/10 transition-all duration-300"
                >
                  Profile
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left mt-1 px-4 py-2 rounded-lg
                           text-red-400 hover:text-red-500 hover:bg-red-500/25
                           transition-all duration-300"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
