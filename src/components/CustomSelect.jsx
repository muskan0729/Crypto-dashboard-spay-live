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
    <div ref={dropdownRef} className="relative w-full sm:w-64">
      {/* Select Box */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          h-[44px]
          cursor-pointer
          px-4
          rounded-2xl
          bg-[#0b0f1a]
          border border-[#1f2937]
          shadow-lg
          text-sm
          flex items-center justify-between
          transition
          hover:bg-[#111827]
          focus:ring-1 focus:ring-[#ffd700]
        "
      >
        {value ? (
          <span className="text-[#ffd700] truncate">{value.label}</span>
        ) : (
          <span className="text-slate-400">{placeholder}</span>
        )}

        <svg
          className={`w-4 h-4 ml-2 text-[#ffd700] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="
            absolute
            mt-2
            w-full
            z-30
            rounded-2xl
            bg-[#0b0f1a]
            border border-[#1f2937]
            shadow-xl
            overflow-hidden
          "
        >
          {/* Search */}
          <div className="p-2 border-b border-[#1f2937]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="
                w-full
                h-[38px]
                px-3
                rounded-xl
                bg-[#020617]
                text-white
                placeholder-slate-500
                outline-none
                focus:ring-1 focus:ring-[#ffd700]
              "
            />
          </div>

          {/* Options */}
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.length ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className="
                    px-4 py-2.5
                    text-sm
                    text-slate-200
                    cursor-pointer
                    transition
                    hover:bg-[#111827]
                    hover:text-[#ffd700]
                  "
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-sm text-slate-500">
                No results found
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
