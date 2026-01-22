import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/sidebar.css";
import Logo from "../images/logo.png";

export const Sidebar = ({ open, setOpen }) => {
  const role = atob(localStorage.getItem("role")); // admin / user / crypto
  const [activeDropdown, setActiveDropdown] = useState(null);

  const location = useLocation();
  const currentPath = location.pathname;

  const toggleDropdown = (name) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Menu configuration
  const menu = [
    { label: "Dashboard", icon: "fa-chart-pie", link: "/krypto-dashboard" },

    ...(role === "admin"
      ? [
        {
          label: "Scheme Manager",
          icon: "fa-money-check",
          dropdown: "scheme",
          items: [{ label: "Scheme", link: "/scheme" }],
        },
        {
          label: "Member",
          icon: "fa-user-group",
          dropdown: "member",
          items: [{ label: "Merchant Onboarding", link: "/member-list" }],
        },
        {
          label: "Fund",
          icon: "fa-piggy-bank",
          dropdown: "fund",
          items: [
            { label: "Load Wallet", link: "/load-wallet" },
            { label: "Payin Settlement", link: "/payin-settlement" },
          ],
        },
        {
          label: "Onboard Bank",
          icon: "fa-building-columns",
          dropdown: "bank",
          items: [{ label: "Bank", link: "/onboard-bank" }],
        },
        {
          label: "Transaction History",
          icon: "fa-clock-rotate-left",
          dropdown: "txn",
          items: [
            { label: "Crypto Statement", link: "/crypto-statement" },
            { label: "Payout Statement", link: "/payout-statement" },
          ],
        },
        {
          label: "Account Statement",
          icon: "fa-layer-group",
          dropdown: "account",
          items: [
            { label: "Topup Statement", link: "/topup-statement" },
            {
              label: "Settlement Payin Statement",
              link: "/settlement-payin-statement",
            },
          ],
        },
      ]
      : []),

    ...(role === "user"
      ? [
        {
          label: "Payin",
          icon: "fa-money-bill-transfer",
          dropdown: "payin",
          items: [{ label: "Request", link: "/payin-request" }],
        },
        {
          label: "Transaction History",
          icon: "fa-clock-rotate-left",
          dropdown: "txn",
          items: [
            { label: "PayIn Statement", link: "/crypto-statement" },
            { label: "Payout Statement", link: "/payout-statement" },
          ],
        },
        {
          label: "Account Statement",
          icon: "fa-layer-group",
          dropdown: "account",
          items: [
            { label: "Topup Statement", link: "/topup-statement" },
            {
              label: "Settlement Payin Statement",
              link: "/settlement-payin-statement",
            },
          ],
        },
        {
          label: "Api Settings",
          icon: "fa-gears",
          dropdown: "api",
          items: [{ label: "Callback & Token", link: "/api-settings" }],
        },
        {
          label: "API Documents",
          icon: "fa-money-check",
          dropdown: "apidoc",
          items: [
            { label: "Payin Documents", link: "/payin-doc" },
            { label: "Payout Documents", link: "/payout-doc" },
          ],
        },
      ]
      : []),

    ...(role === "crypto"
      ? [
        {
          label: "Transaction History",
          icon: "fa-clock-rotate-left",
          dropdown: "txn",
          items: [{ label: "Crypto Statement", link: "/crypto-statement" }],
        },
      ]
      : []),

    {
      label: "Complaints",
      icon: "fa-comment",
      dropdown: "tickets",
      items: [{ label: "View Complain", link: "/view-complain" }],
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-30 md:hidden transition-opacity duration-300
        bg-black/50 backdrop-blur-sm
        ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-70 p-4 flex flex-col z-40
        bg-white/5 backdrop-blur-xl border-r border-cyan-400/20
        shadow-[0_0_30px_rgba(0,255,255,0.2)]
        transform transition-transform duration-300 ease-in-out
        md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Glow background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,255,255,0.05),_transparent_70%)] pointer-events-none rounded-2xl"></div>

        {/* Mobile close button */}
        <button
          className="absolute top-4 right-4 md:hidden text-cyan-300 hover:text-white transition"
          onClick={() => setOpen(false)}
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Logo */}
        <div className="relative flex justify-center items-center w-full mt-5 mb-5">
          <div className="w-24 overflow-hidden bg-white/10 shadow-lg flex justify-center items-center">
            <Link to="/krypto-dashboard">
              <img
                src={Logo}
                className="w-full h-full object-contain"
                alt="Spay Logo"
              />
            </Link>
          </div>
        </div>

        {/* Menu */}
        <ul className="relative space-y-2 font-medium flex-1 overflow-y-auto custom-scrollbar">
          {menu.map((item, i) => {
            const isParentActive =
              item.items?.some((sub) => sub.link === currentPath) ?? false;

            return (
              <li key={i}>
                {!item.dropdown ? (
                  // Single link
                  <Link
                    to={item.link}
                    className={`relative flex items-center w-full rounded-xl transition-all duration-300 transform
                      text-gray-100 hover:bg-cyan-400/10  `}
                  >
                    <i
                      className={`fa-solid ${item.icon} mr-3 text-cyan-300`}
                    ></i>
                    <span className="uppercase tracking-wide">
                      {item.label}
                    </span>
                  </Link>
                ) : (
                  <>
                    {/* Dropdown button */}
                    <button
                      className={`relative flex items-center w-full p-1 rounded-xl transition-all duration-300 transform
                        text-gray-100 hover:bg-cyan-400/10 `}
                      onClick={() => toggleDropdown(item.dropdown)}
                    >
                      <i
                        className={`fa-solid ${item.icon} mr-3 text-cyan-300`}
                      ></i>
                      <span className="uppercase tracking-wide">
                        {item.label}
                      </span>

                      <svg
                        className={`w-3 h-3 ml-auto transition-transform duration-300 ${activeDropdown === item.dropdown ? "rotate-180" : ""
                          }`}
                        fill="none"
                        viewBox="0 0 10 6"
                      >
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          d="m1 1 4 4 4-4"
                        />
                      </svg>
                    </button>

                    {/* Dropdown items */}
                    <div
                      className={`ml-4 mt-1 rounded-lg overflow-hidden transition-all duration-300
                        ${activeDropdown === item.dropdown ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      {item.items.map((sub, j) => {
                        const isActive = currentPath === sub.link;

                        return (
                          <Link key={j} to={sub.link}>
                            <div
                              className={`relative flex items-center gap-2 p-2 rounded-lg transition-all duration-300 transform
                                ${isActive
                                  ? `bg-cyan-500/20 text-cyan-300  before:absolute before:-inset-1 before:rounded-lg before:bg-cyan-400/10 before:blur-lg`
                                  : "text-gray-200 hover:bg-cyan-400/10  hover:scale-105"
                                }`}
                            >
                              <i className="fa-solid fa-circle text-[6px] text-cyan-300"></i>
                              {sub.label}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </>
  );
};
