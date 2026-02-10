import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Prepare data to send to backend
    const payload = {
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      email: form.email,
      password: form.password
    };

    try {
      await axios.post("http://localhost:8080/api/auth/register", payload);
      alert("Registered successfully!");
      navigate("/login");
    } catch (error) {
      alert("Registration failed.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            value={form.firstName}
            required
          />

          <input
            type="text"
            name="middleName"
            placeholder="Middle Name (optional)"
            onChange={handleChange}
            value={form.middleName}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            value={form.lastName}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={form.email}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={form.password}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={form.confirmPassword}
            required
          />

          <button type="submit">Register</button>
        </form>

        <p className="small-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
