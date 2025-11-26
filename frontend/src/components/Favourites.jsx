import React, { useState, useEffect } from "react";

const KEY = "omdb_favorites";

export default function Favorites({ onPick }) {
  const [fav, setFav] = useState([]);

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) || "[]");
      setFav(v);
    } catch (e) {}
  }, []);

  if (!fav.length) return null;

  return (
    <div className="favorites">
      <strong>Favorites:</strong>
      {fav.map((id) => (
        <button key={id} onClick={() => onPick(id)}>
          {id}
        </button>
      ))}
    </div>
  );
}
