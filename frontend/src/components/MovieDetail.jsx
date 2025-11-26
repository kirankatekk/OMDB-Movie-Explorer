import React, { useEffect, useState } from "react";
import axios from "axios";
import SafeImage from "./SafeImage";

export default function MovieDetail({ imdbID, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    axios
      .get(`http://localhost:4000/api/movie/${imdbID}`)
      .then((r) => {
        if (!cancelled) setData(r.data.data);
      })
      .catch(console.error);

    return () => (cancelled = true);
  }, [imdbID]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="
          bg-[#1d1d26] 
          w-[95%] 
          max-w-4xl 
          max-h-[90vh] 
          rounded-2xl 
          p-8 
          shadow-2xl 
          text-white 
          relative 
          overflow-y-auto
        "
      >

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-xl hover:text-red-400 transition"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="flex gap-5">
          {/* Poster */}
          <div className="w-40">
            <SafeImage
              src={data.Poster === "N/A" ? null : data.Poster}
              alt={data.Title}
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-bold">{data.Title}</h2>
            <p className="text-gray-300">{data.Year}</p>

            <p>
              <span className="font-semibold">Director:</span> {data.Director}
            </p>
            <p>
              <span className="font-semibold">Actors:</span> {data.Actors}
            </p>

            <p className="text-sm text-gray-300 leading-snug">
              <span className="font-semibold">Plot:</span> {data.Plot}
            </p>

            <p>
              <span className="font-semibold">IMDb Rating:</span>{" "}
              {data.imdbRating}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
