import { Link, useNavigate } from "react-router-dom";
import { useReadingList } from "../context/ReadingListContext";

function Navbar() {
  const { readingList } = useReadingList();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Library Management System
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        <Link to="/reading-list">
          Reading List ({readingList.length})
        </Link>

        <Link to="/space-booking">Book Space</Link>

        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
