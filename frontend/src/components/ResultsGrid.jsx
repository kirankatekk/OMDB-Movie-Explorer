// ResultsGrid.jsx
import React from "react";
import MovieCard from "./MovieCard";

export default function ResultsGrid({ items = [], onPick, favorites, onFavorite }) {
  if (!items.length) return <div className="empty">No results</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {items.map((it) => (
        <MovieCard
          key={it.imdbID}
          item={it}
          onClick={() => onPick(it.imdbID)}
          onFavorite={onFavorite}
          isFavorite={favorites.includes(it.imdbID)}
        />
      ))}
    </div>
  );
}
