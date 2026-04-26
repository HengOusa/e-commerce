import { useState, useRef, useEffect } from "react";

const Dropdown = ({
  options = [],
  value = null,
  onChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  width = "w-50",
  disabled = false,
  error = false,
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const selected = options.find((opt) => opt.value === value) || null;

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const handleSelect = (opt) => {
    onChange?.(opt);
    setOpen(false);
    setSearchTerm("");
  };

  const getButtonStyles = () => {
    if (disabled)
      return "bg-gray-100 cursor-not-allowed text-gray-400 border-gray-200";
    if (error) return "border-red-400 bg-red-50 hover:border-red-500";
    return "border-gray-300 hover:border-blue-400 hover:shadow-sm";
  };

  return (
    <div className={`relative ${width}`} ref={dropdownRef}>
      {/* Label */}
      {placeholder && !selected && (
        <label className="block text-xs font-medium text-gray-600 mb-1.5 ml-1">
          {placeholder}
        </label>
      )}

      {/* Button */}
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 bg-white rounded-xl text-left 
          flex justify-between items-center text-sm
          border transition-all duration-200
          ${getButtonStyles()}
          ${open ? "ring-2 ring-blue-400 border-blue-400" : ""}
          focus:outline-none
        `}
      >
        <span
          className={`truncate ${!selected ? "text-gray-400" : "text-gray-700"}`}
        >
          {selected ? selected.label : placeholder}
        </span>

        <svg
          className={`
            w-4 h-4 transition-all duration-200 
            ${open ? "rotate-180 text-blue-500" : "text-gray-400"}
            ${disabled ? "text-gray-300" : ""}
          `}
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
      </button>

      {/* Dropdown */}
      {open && !disabled && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown Menu */}
          <div
            className="
            absolute w-full mt-2 bg-white rounded-xl shadow-xl 
            border border-gray-200 z-50 overflow-hidden
            animate-slideDown origin-top
          "
          >
            {/* Search */}
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200
                    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                    transition-all duration-200
                  "
                />
              </div>
            </div>

            {/* Options */}
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt, index) => (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt)}
                    className={`
                      group px-4 py-2.5 cursor-pointer transition-all duration-150
                      flex items-center justify-between
                      ${
                        value === opt.value
                          ? "bg-blue-50 text-blue-700"
                          : "hover:bg-gray-50 text-gray-700"
                      }
                      ${index !== filteredOptions.length - 1 ? "border-b border-gray-50" : ""}
                    `}
                  >
                    <span className="text-sm font-medium">{opt.label}</span>
                    {value === opt.value && (
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-gray-400 text-center text-sm">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  No results found
                </div>
              )}
            </div>

            {/* Footer with count */}
            {filteredOptions.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
                {filteredOptions.length} option
                {filteredOptions.length !== 1 ? "s" : ""} available
              </div>
            )}
          </div>
        </>
      )}

      {/* Error Message */}
      {error && !disabled && (
        <p className="mt-1.5 text-xs text-red-500 ml-1">
          Please select a valid option
        </p>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dropdown;
