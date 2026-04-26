import { useState, useRef, useEffect } from "react";

const MenuDropdown = ({
  options = [],
  value = null,
  onChange,
  placeholder = "Menu",
  searchPlaceholder = "Search...",
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
      return "bg-gray-100 cursor-not-allowed text-gray-400";
    if (error) return "text-red-600 bg-red-50";
    return "hover:bg-gray-100 text-gray-700";
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Menu Button */}
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`
          px-3 py-1.5 rounded-md text-sm font-medium
          transition-all duration-200
          flex items-center gap-2
          ${getButtonStyles()}
          ${open ? "bg-gray-100 ring-1 ring-gray-200" : ""}
          focus:outline-none focus:ring-2 focus:ring-blue-400
        `}
      >
        <span className={!selected && !placeholder ? "text-gray-500" : ""}>
          {selected ? selected.label : placeholder}
        </span>

        <svg
          className={`
            w-3.5 h-3.5 transition-transform duration-200 
            ${open ? "rotate-180" : ""}
            ${disabled ? "text-gray-400" : "text-gray-500"}
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && !disabled && (
        <>
          {/* Invisible backdrop for closing on click outside */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Menu Dropdown */}
          <div
            className="
            absolute left-0 mt-1 min-w-[200px] bg-white rounded-lg shadow-lg 
            border border-gray-200 z-50 overflow-hidden
            animate-slideDown origin-top
          "
          >
            {/* Optional Search */}
            {searchPlaceholder && (
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <svg
                    className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
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
                      w-full pl-8 pr-2 py-1.5 text-sm rounded
                      border border-gray-200 focus:border-blue-400
                      focus:outline-none focus:ring-1 focus:ring-blue-400
                    "
                  />
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="max-h-64 overflow-y-auto py-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt)}
                    className={`
                      group px-3 py-1.5 cursor-pointer transition-colors duration-150
                      flex items-center justify-between gap-3 text-sm
                      ${value === opt.value
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50 text-gray-700"
                      }
                    `}
                  >
                    <span className="flex-1">{opt.label}</span>
                    
                    {/* Shortcut hint (optional) */}
                    {opt.shortcut && (
                      <kbd className="text-xs text-gray-400 font-mono">
                        {opt.shortcut}
                      </kbd>
                    )}
                    
                    {/* Checkmark for selected */}
                    {value === opt.value && (
                      <svg
                        className="w-3.5 h-3.5 text-blue-600 shrink-0"
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
                <div className="px-3 py-6 text-gray-400 text-center text-sm">
                  No results
                </div>
              )}
            </div>

            {/* Optional Divider and Footer */}
            {filteredOptions.length > 0 && (
              <>
                <div className="border-t border-gray-100 my-1"></div>
                <div className="px-3 py-1.5 text-xs text-gray-400 text-center">
                  {filteredOptions.length} item{filteredOptions.length !== 1 ? "s" : ""}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Error indicator */}
      {error && !disabled && (
        <div className="absolute -right-1 -top-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MenuDropdown;