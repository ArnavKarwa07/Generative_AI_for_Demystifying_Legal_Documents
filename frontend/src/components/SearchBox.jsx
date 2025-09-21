import React from "react";

const SearchBox = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  size = "default", // "small", "default", "large"
}) => {
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-sm",
    large: "px-4 py-3 text-base",
  };

  const iconSizes = {
    small: "w-4 h-4 left-2.5",
    default: "w-5 h-5 left-3",
    large: "w-5 h-5 left-3.5",
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute ${iconSizes[size]} top-1/2 transform -translate-y-1 text-gray-400 dark:text-gray-500 pointer-events-none`}
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full ${sizeClasses[size]} ${
          size === "small" ? "pl-8" : size === "large" ? "pl-11" : "pl-10"
        } pr-4
          bg-white dark:bg-slate-800 
          border border-gray-300 dark:border-slate-600 
          rounded-lg 
          text-gray-900 dark:text-white 
          placeholder-gray-500 dark:placeholder-gray-400
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          focus:outline-none 
          transition-colors
        `}
      />
    </div>
  );
};

export default SearchBox;
