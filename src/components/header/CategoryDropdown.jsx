import { useState, useRef, useEffect } from "react";

const CategoryDropdown = () => {
  const options = [
    { value: "", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "home", label: "Home & Kitchen" },
    { value: "books", label: "Books & Audiobooks" },
    { value: "sports", label: "Sports & Outdoors" },
    { value: "toys", label: "Toys & Games" },
    { value: "beauty", label: "Beauty & Personal Care" },
    { value: "automotive", label: "Automotive" },
    { value: "pet-supplies", label: "Pet Supplies" },
    { value: "office", label: "Office Products" },
    { value: "musical", label: "Musical Instruments" },
    { value: "baby", label: "Baby Products" },
    { value: "garden", label: "Garden & Outdoor" },
    { value: "tools", label: "Tools & Home Improvement" },
  ];

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(options[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  // Filter options based on search term
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Close dropdown when clicking outside
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

  // Reset search when dropdown closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  const handleSelect = (opt) => {
    setSelected(opt);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-35 cursor-pointer" ref={dropdownRef}>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-2 py-2 rounded bg-white text-left flex justify-between items-center hover:border-gray-400 transition-colors cursor-pointer text-sm"
      >
        <span className="truncate">{selected.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
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
      {open && (
        <div className="absolute w-full mt-1 bg-white rounded shadow-lg z-50 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b">
            <div className="relative">
              <svg
                className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
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
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 text-sm rounded focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                autoFocus
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div
            className="max-h-60 overflow-y-auto text-sm "
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE and Edge */,
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={`px-3 py-2 cursor-pointer transition-colors ${
                    selected.value === opt.value
                      ? "bg-green-600 text-white"
                      : "hover:bg-green-600 hover:text-white"
                  }`}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-center">
                No categories found
              </div>
            )}
          </div>

          {/* Show count */}
          {filteredOptions.length > 0 && (
            <div className="px-3 py-1.5 text-xs text-gray-500 border-t bg-gray-50">
              {filteredOptions.length} category
              {filteredOptions.length !== 1 ? "ies" : ""} found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
