import { useEffect, useState } from "react";

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, onSearch]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className="search-bar">
      <label htmlFor="book-search" className="sr-only">
        Search books by title or author
      </label>

      <span className="search-icon" aria-hidden="true">
        🔍
      </span>

      <input
        id="book-search"
        type="search"
        placeholder="Search by title or author..."
        value={searchTerm}
        onChange={handleChange}
        autoComplete="off"
      />

      {searchTerm && (
        <button
          type="button"
          className="clear-search"
          onClick={handleClear}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchBar;