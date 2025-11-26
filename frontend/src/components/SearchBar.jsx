import React from "react";
export default function SearchBar({ value, onChange }) {
  return (
    <div className="flex justify-center">
      <input
        type="text"
        placeholder="Search movies or series..."
        className="
          w-full max-w-3xl 
          px-5 py-3 
          rounded-xl 
          bg-[#18181e] 
          text-gray-200
          border border-gray-700
          focus:border-purple-500
          focus:ring-2 focus:ring-purple-600
          transition-all duration-300
          shadow-lg shadow-black/20
        "
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
