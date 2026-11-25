import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchBook() {
      try {
        setLoading(true);
        setError("");

        if (!/^\d+$/.test(id || "") || Number(id) < 1) {
          throw new Error("Invalid book ID.");
        }

        const response = await fetch(`${API_URL}/books/${id}`, {
          signal: controller.signal,
        });

        if (response.status === 404) {
          throw new Error("This book could not be found.");
        }

        if (!response.ok) {
          throw new Error(`Unable to load book (HTTP ${response.status}).`);
        }

        const result = await response.json();
        setBook(result);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to retrieve book details.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchBook();

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <main className="detail-page">
        <div className="detail-state" role="status">
          <div className="detail-spinner" />
          <p>Loading book details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="detail-page">
        <div className="state-container error-state">
          <div className="state-icon">!</div>
          <h2>Book unavailable</h2>
          <p>{error}</p>
          <Link to="/" className="primary-button">
            Return to Catalog
          </Link>
        </div>
      </main>
    );
  }

  if (!book) return null;

  const available = Number(book.availableCopies ?? 0);
  const total = Number(book.totalCopies ?? 0);

  return (
    <main className="detail-page">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <span className="brand-icon">▤</span>
            <span>Library<span className="brand-accent">Hub</span></span>
          </Link>
          <span className="header-label">BOOK DETAILS</span>
        </div>
      </header>

      <div className="detail-container">
        <Link to="/" className="back-link">
          ← Back to Library
        </Link>

        <article className="detail-card">
          <div className="detail-cover">
            <span className="detail-cover-label">
              {book.genre?.name || "Library Collection"}
            </span>
            <div className="detail-cover-decoration">✦</div>
            <h1>{book.title}</h1>
            <p>By {book.author}</p>
          </div>

          <div className="detail-content">
            <span className="section-eyebrow">BOOK INFORMATION</span>
            <h2>{book.title}</h2>
            <p className="detail-author">By {book.author}</p>

            <div className="detail-availability">
              <span className={available > 0 ? "available-text" : "unavailable-text"}>
                {available > 0 ? "● Available" : "● Currently unavailable"}
              </span>
              <span>{available} of {total} copies available</span>
            </div>

            <div className="detail-information">
              <div className="info-item">
                <span>Author</span>
                <strong>{book.author}</strong>
              </div>
              <div className="info-item">
                <span>Genre</span>
                <strong>{book.genre?.name || "Not specified"}</strong>
              </div>
              <div className="info-item">
                <span>ISBN</span>
                <strong>{book.isbn || "Not available"}</strong>
              </div>
              <div className="info-item">
                <span>Publication Year</span>
                <strong>{book.publicationYear || "Not specified"}</strong>
              </div>
              <div className="info-item">
                <span>Total Copies</span>
                <strong>{total}</strong>
              </div>
              <div className="info-item">
                <span>Available Copies</span>
                <strong>{available}</strong>
              </div>
              <div className="info-item">
                <span>Reviews</span>
                <strong>{book._count?.reviews ?? 0}</strong>
              </div>
            </div>

            <div className="description-section">
              <h3>About This Book</h3>
              <p>
                {book.description || "No description is currently available for this book."}
              </p>
            </div>

            <Link to="/" className="primary-button detail-return">
              ← Browse More Books
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

export default BookDetail;
