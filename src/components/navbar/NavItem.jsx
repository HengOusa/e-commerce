import React, { useState, useRef, useEffect } from "react";

const NavItem = ({ 
  label, 
  dropdownItems, 
  megaMenu, 
  contactInfo, 
  type = "default",
  align = "left" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getDropdownPosition = () => {
    switch (align) {
      case "right": return "right-0";
      case "center": return "left-1/2 -translate-x-1/2";
      default: return "left-0";
    }
  };

  const renderDropdownContent = () => {
    switch (type) {
      case "mega":
        return (
          <div className="grid grid-cols-4 gap-6 p-6 w-[780px] bg-white">
            {megaMenu?.columns.map((column, idx) => (
              <div key={idx}>
                <h4 className="font-bold text-gray-800 text-sm mb-3 border-b pb-1">
                  {column.title}
                </h4>
                <ul className="space-y-2 text-sm">
                  {column.items.map((item, itemIdx) => (
                    <li key={itemIdx}>
                      <a
                        href={item.link}
                        className={`${item.isHot ? 'text-red-500 font-medium' : 'text-gray-500'} hover:text-blue-600 transition`}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
                {column.special && (
                  <div className="mt-3 bg-blue-50 p-2 rounded text-center text-xs">
                    {column.special}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "vendors":
        return (
          <div className="py-2 w-64">
            <div className="px-5 py-1 text-xs text-gray-400">Featured Vendors</div>
            {dropdownItems?.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className={`flex items-center gap-3 px-5 py-2 hover:bg-gray-50 transition ${
                  item.isSpecial ? 'bg-gray-50 mt-1' : ''
                }`}
              >
                {item.icon && <i className={`fas ${item.icon} text-gray-400 w-5`}></i>}
                <span className={`text-sm ${item.isSpecial ? 'text-blue-500 font-medium' : 'text-gray-700'}`}>
                  {item.label}
                </span>
              </a>
            ))}
          </div>
        );

      case "blog":
        return (
          <div className="py-2 w-56">
            <div className="px-5 py-1 text-xs text-gray-400">Latest stories</div>
            {dropdownItems?.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className={`block px-5 py-2 hover:bg-gray-50 transition ${
                  item.isViewAll ? 'border-t mt-1 text-blue-500' : 'text-gray-700'
                }`}
              >
                {item.description ? (
                  <>
                    <span className="font-medium">{item.label}</span>
                    <span className="block text-xs text-gray-400">{item.description}</span>
                  </>
                ) : (
                  <span>{item.label}</span>
                )}
              </a>
            ))}
          </div>
        );

      case "contact":
        return (
          <div className="py-3 w-64">
            <div className="px-5 pb-2">
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                <i className="fas fa-envelope text-blue-400 w-5"></i>
                <span>{contactInfo?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                <i className="fas fa-phone-alt text-green-500 w-5"></i>
                <span>{contactInfo?.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <i className="fab fa-whatsapp text-green-600 w-5"></i>
                <span>WhatsApp chat</span>
              </div>
            </div>
            <hr className="my-1" />
            <div className="px-5 pt-2 flex gap-4 justify-start">
              {contactInfo?.social.map((social, idx) => (
                <a key={idx} href={social.link} target="_blank" rel="noopener noreferrer">
                  <i className={`fab ${social.icon} text-gray-500 hover:text-blue-600 cursor-pointer text-lg transition`}></i>
                </a>
              ))}
            </div>
            <div className="px-5 pt-2 pb-1">
              <a href="/contact" className="text-xs text-blue-500">Contact form →</a>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-2">
            {dropdownItems?.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className={`block px-5 py-2 text-sm hover:bg-gray-50 transition ${
                  item.isHighlight ? 'text-blue-600 font-medium border-t mt-1 pt-2' : 'text-gray-700'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="text-gray-600 cursor-pointer hover:text-blue-600 transition-colors flex items-center gap-1 font-medium text-[15px] whitespace-nowrap">
        {label}
        <i className={`fas fa-chevron-down text-[10px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </span>
      
      {isOpen && (
        <div
          className={`absolute top-full pt-2 z-30 ${getDropdownPosition()}`}
          style={{ minWidth: type === "mega" ? '780px' : '200px' }}
        >
          <div className={`bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden ${
            type === "mega" ? 'mega-scroll' : ''
          }`}>
            {renderDropdownContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavItem;