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
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
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
    <nav
      className="
        relative w-full p-4
        bg-black
        bg-gradient-to-br from-red-300/20 via-yellow-200/20 to-red-250/20
        backdrop-blur-2xl
        border border-white/10
        shadow-xl shadow-red-500/20
        z-30
      "
    >
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden text-2xl text-red-400 hover:text-yellow-400 transition"
          >
            ☰
          </button>

          {role !== "admin" && (
            <>
              <div className="hidden md:flex items-center gap-6 text-sm">
                {(role === "crypto" ? cryptoStats : userStats).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/30 border border-white/10"
                  >
                    <i className={`${item.icon} fa-lg text-red-400`} />
                    <span className="text-gray-300">{item.label}:</span>
                    <span className="font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex md:hidden gap-4">
                {(role === "crypto" ? cryptoStats : userStats).map((item) => (
                  <div key={item.id} className="relative">
                    <button
                      onClick={() =>
                        setActiveStat(activeStat === item.id ? null : item.id)
                      }
                      className="text-red-400 hover:text-yellow-400 transition"
                    >
                      <i className={`${item.icon} fa-xl`} />
                    </button>

                    {activeStat === item.id && (
                      <div
                        className="
                          absolute left-1/2 -translate-x-1/2 mt-2 w-44 p-3 rounded-xl
                          bg-gradient-to-br from-red-600/40 to-yellow-500/40
                          border border-white/10 shadow-xl text-sm z-50
                        "
                      >
                        <div className="text-gray-300">{item.label}</div>
                        <div className="font-semibold text-white">{item.value}</div>
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
          <button onClick={() => setOpen(!open)} className="flex items-center">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRduYoJopcD2_WmDjt978P3pjTLl-oQX-ZsTOaof805POhNgFzpYEy5LnA&s"
              alt="profile"
              className="w-10 h-10 rounded-full border border-white/20 shadow-md"
            />
          </button>

          {open && (
            <div
              className="
                absolute right-0 mt-3 w-64 rounded-xl p-4
                bg-gradient-to-br from-red-600/40 to-yellow-500/40
                border border-white/10 shadow-xl text-white z-50
              "
            >
              <div className="text-center mb-3">
                <h6 className="font-semibold">
                  {merchantData?.data?.name || "Admin"}
                </h6>
                <p className="text-sm text-gray-300">{merchantData?.data?.email}</p>
              </div>

              <hr className="border-white/10 mb-3" />

              {role !== "admin" && (
                <Link
                  to="/profile"
                  className="block px-4 py-2 rounded-lg hover:bg-white/10 transition"
                >
                  Profile
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left mt-1 px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition"
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
