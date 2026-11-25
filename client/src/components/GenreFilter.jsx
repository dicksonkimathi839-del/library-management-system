import { useEffect, useState } from "react";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

function GenreFilter({ selectedGenre, onGenreChange }) {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchGenres() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/genres`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load genres.");
        }

        const result = await response.json();

        const genreList = Array.isArray(result)
          ? result
          : result.data || result.genres || [];

        setGenres(genreList);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load genres.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchGenres();

    return () => controller.abort();
  }, []);

  return (
    <div className="genre-filter">
      <label htmlFor="genre-filter">Genre:</label>

      <select
        id="genre-filter"
        value={selectedGenre}
        onChange={(event) => onGenreChange(event.target.value)}
        disabled={loading}
      >
        <option value="">All Genres</option>

        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      {loading && (
        <span className="filter-status">Loading genres...</span>
      )}

      {error && (
        <span className="filter-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export default GenreFilter;