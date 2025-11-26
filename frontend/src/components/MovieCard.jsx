// MovieCard.jsx
import React from "react";
import SafeImage from "./SafeImage";

export default function MovieCard({ item, onClick, onFavorite, isFavorite }) {
  return (
    <div
      className="
        relative 
        bg-[#1c1c24] 
        rounded-xl 
        p-3 
        shadow-lg 
        hover:scale-105 
        transition-transform 
        duration-200 
        cursor-pointer
        border border-transparent
        hover:border-purple-500
      "
      onClick={onClick}
    >
      {/* Heart Icon */}
      <div
        className="absolute top-2 right-2 text-2xl z-20"
        onClick={(e) => {
          e.stopPropagation();
          onFavorite(item.imdbID);
        }}
      >
        {isFavorite ? "❤️" : "🤍"}
      </div>

      <SafeImage src={item.poster} alt={item.title} />

      <div className="mt-3">
        <div className="font-semibold text-lg">{item.title}</div>
        <div className="text-gray-400 text-sm">{item.year}</div>
      </div>
    </div>
  );
}
