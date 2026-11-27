import { Routes, Route, Link } from "react-router-dom";
import { ReadingListProvider } from "./context/ReadingListContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import BookDetail from "./pages/BookDetail.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SpaceBookingPage from "./pages/SpaceBookingPage.jsx";
import ReadingListPage from "./pages/ReadingListPage.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function NotFound() {
  return (
    <main className="not-found">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Return to Home</Link>
    </main>
  );
}

function App() {
  return (
    <ReadingListProvider>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/reading-list" element={<ReadingListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/space-booking"
          element={
            <ProtectedRoute>
              <SpaceBookingPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ReadingListProvider>
  );
}

export default App;
