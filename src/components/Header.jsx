import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePost } from "../hooks/usePost";
import useAutoFetch from "../hooks/useAutoFetch";
import { useGet } from "../hooks/useGet";
import "../css/header.css";

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
  const email = localStorage.getItem("email");

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
    <nav className="relative w-full bg-black border-b border-white/10 shadow-xl z-30">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-orange-500/10  pointer-events-none" />

      <div className="relative flex items-center justify-between px-4 py-3  bg-white/5">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden text-2xl text-[#ffd700] hover:text-yellow-400 transition"
          >
            ☰
          </button>

          {role !== "admin" && (
            <>
              {/* Desktop Stats */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                {(role === "crypto" ? cryptoStats : userStats).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl
                               bg-white/5 
                               border border-white/10 shadow-lg"
                  >
                    <i className={`${item.icon} fa-lg text-[#ffd700]`} />
                    <span className="text-white/70">{item.label}:</span>
                    <span className="font-semibold text-white">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile Stats */}
              <div className="flex md:hidden gap-4">
                {(role === "crypto" ? cryptoStats : userStats).map((item) => (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() =>
                        setActiveStat(activeStat === item.id ? null : item.id)
                      }
                      className="text-[#ffd700] hover:text-yellow-400 transition"
                    >
                      <i className={`${item.icon} fa-xl`} />
                    </button>

                    {activeStat === item.id && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 mt-3 w-48 p-4
                                   rounded-2xl bg-white/20
                                   border border-white/10 shadow-xl z-50"
                      >
                        <div className="text-white/70 text-sm">
                          {item.label}
                        </div>
                        <div className="font-semibold text-white">
                          {item.value}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
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
              className="w-10 h-10 rounded-full
                         border border-white/20
                         shadow-lg"
            />
          </button>

          {open && (
            <div
              className="absolute right-0 mt-3 w-64 p-4 rounded-2xl
                         bg-black/50 
                         border border-white/10 shadow-xl z-50"
            >
              <div className="text-center mb-4">
                <h6 className="font-semibold text-[#ffd700]">
                  {merchantData?.data?.name || "Admin"}
                </h6>
                <p className="text-sm text-white/60">
                  {merchantData?.data?.email}
                </p>
              </div>

              <hr className="border-white/10 mb-3" />

              {role !== "admin" && (
                <Link
                  to="/profile"
                  className="block px-4 py-2 rounded-lg
                             text-white/80 hover:text-white
                             hover:bg-white/10 transition"
                >
                  Profile
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left mt-1 px-4 py-2 rounded-lg
                           text-red-400 hover:text-red-500 hover:bg-red-500/25 transition"
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
