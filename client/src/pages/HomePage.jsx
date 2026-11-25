import { useCallback, useState } from "react";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";
import BookGrid from "../components/BookGrid";

function HomePage() {
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const handleSearch = useCallback((value) => {
    setSearch(value);
  }, []);

  return (
    <main className="page-container">
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="brand">
            <span className="brand-icon">▤</span>
            <span>Library<span className="brand-accent">Hub</span></span>
          </a>
          <span className="header-label">PATRON CATALOG</span>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <span className="eyebrow">DISCOVER YOUR NEXT READ</span>
          <h1>Explore. Discover. <span>Read.</span></h1>
          <p>
            Browse our collection, discover new authors and find
            the perfect book for your next reading adventure.
          </p>
        </div>
      </section>

      <section className="catalog-section">
        <div className="catalog-heading">
          <div>
            <span className="section-eyebrow">OUR COLLECTION</span>
            <h2>Explore the Library</h2>
            <p>Find books by title, author or genre.</p>
          </div>
        </div>

        <div className="catalog-toolbar">
          <div className="toolbar-search">
            <SearchBar onSearch={handleSearch} />
          </div>

          <GenreFilter
            selectedGenre={genreId}
            onGenreChange={setGenreId}
          />

          <div className="sort-control">
            <label htmlFor="sort-books">Sort by:</label>
            <select
              id="sort-books"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="title">Title (A–Z)</option>
              <option value="author">Author (A–Z)</option>
            </select>
          </div>
        </div>

        <BookGrid
          genreId={genreId}
          search={search}
          sortBy={sortBy}
        />
      </section>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} LibraryHub. All rights reserved.</p>
        <p>Discover knowledge. One book at a time.</p>
      </footer>
    </main>
  );
}

export default HomePage;
