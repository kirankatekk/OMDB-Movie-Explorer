import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import ResultsGrid from "./components/ResultsGrid";
import MovieDetail from "./components/MovieDetail";
import FavoriteSection from "./components/FavouriteSection";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const [favorites, setFavorites] = useState([]); // list of IMDb IDs
  const [favoriteMovies, setFavoriteMovies] = useState([]); // list of full movie objects

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);
  }, []);

  // Fetch full details for ALL favorite movies
  useEffect(() => {
    async function loadFavoriteMovies() {
      if (favorites.length === 0) {
        setFavoriteMovies([]);
        return;
      }

      let movieList = [];

      for (const id of favorites) {
        try {
          const r = await axios.get(`http://localhost:4000/api/movie/${id}`);
          movieList.push(r.data.data);
        } catch (e) {
          console.error("Failed to load favorite:", id, e);
        }
      }

      setFavoriteMovies(movieList);
    }

    loadFavoriteMovies();
  }, [favorites]);

  // Add or remove favorite movie IDs
  const toggleFavorite = (id) => {
    let updated;

    if (favorites.includes(id)) {
      updated = favorites.filter((f) => f !== id);
    } else {
      updated = [...favorites, id];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  // Search logic
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      try {
        setLoading(true);

        const r = await axios.get("http://localhost:4000/api/search", {
          params: { q: query },
          signal: controller.signal,
        });

        const unique = [];
        const seen = new Set();

        (r.data.data || []).forEach((item) => {
          if (!seen.has(item.imdbID)) {
            seen.add(item.imdbID);
            unique.push(item);
          }
        });

        setResults(unique);
      } catch (err) {
        if (err.name === "CanceledError") return;
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(fetchResults, 400);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="text-center mb-10">
        <h1
  className="
    text-4xl
    font-extrabold
    tracking-wide
    bg-clip-text
    text-transparent
    bg-gradient-to-r from-white via-gray-200 to-white
    drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]
  "
>
  OMDB Movie Explorer
</h1>

      </header>

      <SearchBar value={query} onChange={setQuery} />

      {loading && (
        <div className="text-center text-gray-300 mt-4 animate-pulse">
          Loading...
        </div>
      )}

      {query.trim().length === 0 && (
  <div className="text-center mt-10 mb-6">

    <p className="text-gray-300 text-xl tracking-wide">
      Discover movies, shows, and legendary stories…
    </p>

    <p className="text-gray-400 text-md mt-1">
      Start typing to explore the cinematic universe 🎬
    </p>

    {/* Remove giant orb — replace with smaller subtle glow */}
    <div className="flex justify-center mt-6">
      <div className="
        w-40 h-40
        rounded-full
        bg-gradient-to-br 
        from-purple-800/30 
        via-pink-500/10 
        to-indigo-400/10
        blur-2xl opacity-40
      "></div>
    </div>

  </div>
)}



      {results.length > 0 && (
        <div className="mt-8">
          <ResultsGrid
            items={results}
            onPick={(id) => setSelected(id)}
            favorites={favorites}
            onFavorite={toggleFavorite}
          />
        </div>
      )}

      {/* Favorites Always Visible */}
      <div className="mt-12">
        <FavoriteSection
          movies={favoriteMovies}
          favorites={favorites}
          onPick={(id) => setSelected(id)}
          onFavorite={toggleFavorite}
        />
      </div>

      {selected && (
        <MovieDetail imdbID={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
