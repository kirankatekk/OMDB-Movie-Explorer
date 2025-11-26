// FavoriteSection.jsx
import React from "react";
import MovieCard from "./MovieCard";

export default function FavoriteSection({
  movies,
  favorites,
  onPick,
  onFavorite,
}) {
  return (
    <div className="favorite-section" style={{ marginTop: "30px" }}>
      <h2>Your Favorites</h2>

      {favorites.length === 0 && (
        <div className="flex justify-center text-gray-400 text-sm mt-2">
          You haven’t added any favorites yet. ❤️
          <br />
          Click the heart on any movie to save it!
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            item={{
              imdbID: movie.imdbID,
              title: movie.Title,
              year: movie.Year,
              poster: movie.Poster === "N/A" ? null : movie.Poster,
            }}
            onClick={() => onPick(movie.imdbID)}
            onFavorite={onFavorite}
            isFavorite={true}
          />
        ))}
      </div>
    </div>
  );
}
