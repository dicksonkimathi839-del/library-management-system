import { Link } from "react-router-dom";
import { useReadingList } from "../context/ReadingListContext.jsx";

function BookCard({ book }) {
  const { readingList, addBook, removeBook } = useReadingList();

  const available = Number(book.availableCopies ?? 0);
  const total = Number(book.totalCopies ?? 0);

  const isAvailable = available > 0;

  const title = book.title || "Untitled Book";
  const author = book.author || "Unknown Author";
  const genreName = book.genre?.name || "Uncategorized";

  const isSaved = readingList.some(
    (item) => String(item.id) === String(book.id)
  );

  const handleReadingList = () => {
    if (isSaved) {
      removeBook(book.id);
    } else {
      addBook(book);
    }
  };

  return (
    <article className="book-card">
      <div className="book-cover">
        <div className="book-cover-content">
          <span className="cover-category">{genreName}</span>

          <h3 className="cover-title">{title}</h3>

          <p className="cover-author">{author}</p>

          <div className="cover-decoration">
            <span>✦</span>
          </div>
        </div>

        <span
          className={`availability-badge ${
            isAvailable ? "available" : "unavailable"
          }`}
        >
          {isAvailable ? "Available" : "Unavailable"}
        </span>
      </div>

      <div className="book-card-content">
        <div className="book-card-meta">
          <span className="book-genre">{genreName}</span>

          {book.publicationYear && (
            <span className="book-year">{book.publicationYear}</span>
          )}
        </div>

        <h3 className="book-title">{title}</h3>

        <p className="book-author">By {author}</p>

        <p className="book-isbn">
          ISBN: {book.isbn || "Not available"}
        </p>

        <div className="book-stock">
          <span>
            {available} of {total} copies available
          </span>
        </div>

        <button
          type="button"
          className="reading-list-button"
          onClick={handleReadingList}
        >
          {isSaved ? "✓ Remove from Reading List" : "+ Add to Reading List"}
        </button>

        <Link to={`/books/${book.id}`} className="view-book-button">
          View Details
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}

export default BookCard;
