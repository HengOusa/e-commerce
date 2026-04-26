import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Badge = ({ icon, count }) => {
  return (
    <div className="relative inline-block">
      <FontAwesomeIcon icon={icon} className="text-2xl cursor-pointer" />

      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5">
          {count}
        </span>
      )}
    </div>
  );
};

export default Badge;
