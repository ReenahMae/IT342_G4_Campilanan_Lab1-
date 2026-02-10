import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("User");

  useEffect(() => {
    // If you saved user info in localStorage later, show it here
    // Example stored: localStorage.setItem("user", JSON.stringify({ firstName: "Mae" }))
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const fullName = [user.firstName, user.middleName, user.lastName]
          .filter(Boolean)
          .join(" ");
        if (fullName.trim()) setName(fullName);
      } catch (e) {
        // ignore parse error
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // prevents going back to dashboard via back button
    navigate("/login", { replace: true });
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Dashboard</h2>
        <p>Welcome, <b>{name}</b>!</p>
        <p>You are logged in successfully.</p>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

export default Dashboard;
