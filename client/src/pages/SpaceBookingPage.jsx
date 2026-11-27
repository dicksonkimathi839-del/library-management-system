import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function SpaceBookingPage() {
  const [formData, setFormData] = useState({
    space: "",
    date: "",
    startTime: "",
    endTime: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (formData.startTime >= formData.endTime) {
      setError("End time must be later than start time.");
      return;
    }

    if (formData.date < today) {
      setError("Please select a future date.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must login before booking a space.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/spaces/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking failed.");
      }

      setMessage("Space booking submitted successfully!");

      setFormData({
        space: "",
        date: "",
        startTime: "",
        endTime: "",
      });
    } catch (err) {
      setError(err.message || "Unable to submit booking.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-card">
        <h1>Book Library Space</h1>

        <p>Reserve a space for your study or group session.</p>

        {message && <p className="success-message">{message}</p>}

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="space">Select Space</label>

            <select
              id="space"
              name="space"
              value={formData.space}
              onChange={handleChange}
              required
            >
              <option value="">-- Select a space --</option>
              <option value="Study Room">Study Room</option>
              <option value="Discussion Room">Discussion Room</option>
              <option value="Computer Lab">Computer Lab</option>
              <option value="Conference Room">Conference Room</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Booking Date</label>

            <input
              id="date"
              type="date"
              name="date"
              min={today}
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>

            <input
              id="startTime"
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time</label>

            <input
              id="endTime"
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Booking"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SpaceBookingPage;
