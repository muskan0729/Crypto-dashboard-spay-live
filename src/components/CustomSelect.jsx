import { useEffect, useRef, useState } from "react";

export const CustomSelect = ({
  options = [],
  placeholder = "Select Option",
  onChange,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange?.(option);
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div
      ref={dropdownRef}
      className="relative w-full sm:w-64 font-sans text-white"
      style={{ fontFeatureSettings: "'calt' 1, 'ss01' 1" }}
    >
      {/* Select Box */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          h-[44px] w-full
          cursor-pointer
          px-5
          rounded-2xl
          bg-white/5
          backdrop-blur-xl
          border border-transparent
          ring-1 ring-white/10
          shadow-inner shadow-cyan-900/40
          text-cyan-300
          tracking-wide
          flex items-center justify-between
          transition
          duration-300
          ease-in-out
          hover:ring-cyan-400 hover:shadow-[0_0_15px_cyan]
          focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:shadow-[0_0_20px_cyan]
          select-none
          transform-gpu
          hover:scale-[1.02]
        "
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value ? (
          <span className="truncate text-cyan-400">{value.label}</span>
        ) : (
          <span className="truncate text-slate-400">{placeholder}</span>
        )}

        <svg
          className={`w-5 h-5 ml-3 text-cyan-400 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute
            mt-2
            w-full
            z-50
            rounded-2xl
            bg-white/5
            backdrop-blur-xl
            border border-cyan-600/50
            shadow-[0_0_20px_cyan]
            overflow-hidden
            select-text
          "
          role="listbox"
          tabIndex={-1}
        >
          {/* Search */}
          <div className="p-3 border-b border-cyan-600/30">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="
                w-full
                h-[40px]
                px-4
                rounded-xl
                bg-white/10
                backdrop-blur-md
                text-cyan-200
                placeholder-cyan-500
                outline-none
                ring-1 ring-transparent
                transition
                duration-300
                ease-in-out
                focus:ring-2 focus:ring-cyan-500 focus:ring-offset-1 focus:ring-offset-transparent
                shadow-[inset_0_0_8px_cyan]
                tracking-wide
                font-medium
              "
              autoFocus
              aria-label="Search options"
            />
          </div>

          {/* Options */}
          <ul className="max-h-52 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/60 scrollbar-track-transparent">
            {filteredOptions.length ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className="
                    px-5 py-3
                    text-sm
                    text-cyan-300
                    cursor-pointer
                    transition
                    duration-300
                    ease-in-out
                    hover:bg-cyan-700/40
                    hover:shadow-[0_0_12px_cyan]
                    hover:text-cyan-100
                    focus:bg-cyan-600/50
                    focus:text-cyan-100
                    rounded-lg
                    outline-none
                    select-none
                  "
                  role="option"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleSelect(opt);
                    }
                  }}
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-5 py-4 text-sm text-cyan-600 select-none">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
