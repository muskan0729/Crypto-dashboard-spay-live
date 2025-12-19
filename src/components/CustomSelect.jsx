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
    <div ref={dropdownRef} className="relative w-56">
      {/* Select box */}
      <div
        className="border border-[#FFD700] rounded-lg bg-black text-[#d4af37] cursor-pointer px-3 py-2 text-sm shadow-md hover:bg-[#1a1a1a] transition"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value ? (
          <span>{value.label}</span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute w-full mt-1 border border-[#FFD700] rounded-lg bg-[#10172e] z-10 shadow-lg">
          {/* Search input */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full border-b border-[#FFD700]/50 px-3 py-2 bg-[#10172e] text-[#d4af37] placeholder-gray-400 outline-none rounded-t-lg focus:ring-1 focus:ring-[#FFD700]"
          />

          {/* Options */}
          <ul className="max-h-40 overflow-y-auto">
            {filteredOptions.length ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className="px-3 py-2 text-[#d4af37] hover:bg-[#FFD700]/20 cursor-pointer transition text-sm"
                >
                  {opt.label}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500 text-sm">No results</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
