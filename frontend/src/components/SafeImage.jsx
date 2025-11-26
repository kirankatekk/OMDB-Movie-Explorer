import React, { useState } from "react";

export default function SafeImage({ src, alt, className }) {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  if (error || src === null || src === "N/A" || src === "") {
    // Render a styled No Image box instead of <img>
    return (
      <div
        className="no-image-box"
        style={{
          width: "100%",
          height: "220px",
          background: "#e5e5e5",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
          fontWeight: "bold",
          color: "#555",
          border: "1px solid #ccc"
        }}
      >
        No Image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "6px" }}
    />
  );
}
