import { Link } from "react-router-dom";
import { useReadingList } from "../context/ReadingListContext.jsx";

function ReadingListPage() {
  const { readingList, removeBook, clearList } = useReadingList();

  return (
    <main className="page-container">
      <section className="catalog-section">
        <div className="catalog-heading">
          <div>
            <span className="section-eyebrow">YOUR COLLECTION</span>
            <h2>My Reading List</h2>
            <p>
              {readingList.length}{" "}
              {readingList.length === 1 ? "book" : "books"} saved for later.
            </p>
          </div>

          {readingList.length > 0 && (
            <button type="button" onClick={clearList}>
              Clear Reading List
            </button>
          )}
        </div>

        {readingList.length === 0 ? (
          <div className="empty-state">
            <h3>Your reading list is empty</h3>
            <p>Browse the library and save books you would like to read.</p>
            <Link to="/">Explore Books</Link>
          </div>
        ) : (
          <div className="book-grid">
            {readingList.map((book) => (
              <article className="book-card" key={book.id}>
                <div className="book-card-content">
                  <span className="book-genre">
                    {book.genre?.name || "Uncategorized"}
                  </span>

                  <h3 className="book-title">
                    {book.title || "Untitled Book"}
                  </h3>

                  <p className="book-author">
                    By {book.author || "Unknown Author"}
                  </p>

                  <Link
                    to={`/books/${book.id}`}
                    className="view-book-button"
                  >
                    View Details
                  </Link>

                  <button
                    type="button"
                    className="reading-list-button"
                    onClick={() => removeBook(book.id)}
                  >
                    Remove from Reading List
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default ReadingListPage;
