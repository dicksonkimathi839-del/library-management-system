import { useEffect, useState } from "react";
import BookCard from "./BookCard";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

function BookGrid({ genreId, search, sortBy }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBooks() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          page: "1",
          limit: "100",
        });

        if (genreId) params.set("genreId", genreId);
        if (search) params.set("search", search);

        const response = await fetch(
          `${API_URL}/books?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "The books endpoint could not be found."
              : `Unable to load books (HTTP ${response.status}).`
          );
        }

        const result = await response.json();

        const bookList = Array.isArray(result)
          ? result
          : result.data || result.books || [];

        if (!Array.isArray(bookList)) {
          throw new Error("The server returned an invalid books response.");
        }

        setBooks(bookList);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Something went wrong while loading books."
          );
          setBooks([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBooks();

    return () => controller.abort();
  }, [genreId, search, retry]);

  const sortedBooks = [...books].sort((a, b) => {
    if (sortBy === "title") {
      return (a.title || "").localeCompare(b.title || "");
    }

    if (sortBy === "author") {
      return (a.author || "").localeCompare(b.author || "");
    }

    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  if (loading) {
    return (
      <section className="books-section" aria-label="Loading books">
        <div className="books-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="skeleton-card" key={index}>
              <div className="skeleton-cover skeleton" />
              <div className="skeleton-line skeleton" />
              <div className="skeleton-line short skeleton" />
              <div className="skeleton-button skeleton" />
            </div>
          ))}
        </div>
        <p className="loading-message" role="status">
          Loading books...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <div className="state-container error-state" role="alert">
        <div className="state-icon">!</div>
        <h3>Unable to load books</h3>
        <p>{error}</p>
        <button
          type="button"
          className="primary-button"
          onClick={() => setRetry((value) => value + 1)}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (sortedBooks.length === 0) {
    return (
      <div className="state-container empty-state">
        <div className="state-icon">⌕</div>
        <h3>No books found</h3>
        <p>
          We couldn't find any books matching your search or selected genre.
          Try another keyword or choose a different genre.
        </p>
      </div>
    );
  }

  return (
    <section className="books-section">
      <div className="results-heading">
        <h3>Available Books</h3>
        <span>{sortedBooks.length} {sortedBooks.length === 1 ? "book" : "books"} found</span>
      </div>

      <div className="books-grid">
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}

export default BookGrid;
