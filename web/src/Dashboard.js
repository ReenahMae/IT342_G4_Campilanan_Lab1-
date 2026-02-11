import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>

        <p>
          Welcome, <b>{user?.firstName || "User"}</b>!
        </p>
        <p>You are logged in successfully.</p>

        <button type="button" onClick={() => navigate("/profile")}>
          Profile Settings
        </button>

        <button type="button" onClick={handleLogout} style={{ marginTop: 10 }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
