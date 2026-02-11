import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // Load user from localStorage first (fast)
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const u = JSON.parse(savedUser);
      setForm((prev) => ({
        ...prev,
        firstName: u.firstName || "",
        middleName: u.middleName || "",
        lastName: u.lastName || "",
        email: u.email || ""
      }));
    }

    // Optional: also fetch latest from backend
    axios
      .get("http://localhost:8080/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        const u = res.data;
        setForm((prev) => ({
          ...prev,
          firstName: u.firstName || "",
          middleName: u.middleName || "",
          lastName: u.lastName || "",
          email: u.email || ""
        }));
        localStorage.setItem("user", JSON.stringify(u));
      })
      .catch(() => {
        // ignore if not available yet
      });
  }, [navigate]);

  const handleChange = (e) => {
    setMsg("");
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMsg("");
    setErrorMsg("");

    if (form.newPassword || form.confirmNewPassword) {
      if (form.newPassword !== form.confirmNewPassword) {
        setErrorMsg("New passwords do not match.");
        return;
      }
      if (form.newPassword.length < 6) {
        setErrorMsg("New password must be at least 6 characters.");
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:8080/api/profile",
        {
          firstName: form.firstName,
          middleName: form.middleName,
          lastName: form.lastName,
          newPassword: form.newPassword || null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // backend returns updated user
      localStorage.setItem("user", JSON.stringify(res.data));

      setForm((prev) => ({
        ...prev,
        newPassword: "",
        confirmNewPassword: ""
      }));

      setMsg("Profile updated successfully!");
    } catch (error) {
      const m =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Update failed.";
      setErrorMsg(String(m));
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Profile Settings</h2>

        {msg && <p className="success-text">{msg}</p>}
        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <form onSubmit={handleSave}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="middleName"
            placeholder="Middle Name (optional)"
            value={form.middleName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
          />

          <input type="email" value={form.email} readOnly />

          <hr style={{ margin: "14px 0" }} />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password (optional)"
            value={form.newPassword}
            onChange={handleChange}
          />

          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={form.confirmNewPassword}
            onChange={handleChange}
          />

          <button type="submit">Save Changes</button>
        </form>

        <p className="small-text" style={{ marginTop: 12 }}>
          <span
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </span>
        </p>
      </div>
    </div>
  );
}

export default Profile;
