import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setErrorMsg("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email: form.email,
        password: form.password
      });

      // expected backend response:
      // { token: "xxx", user: { firstName, middleName, lastName, email } }
      const token = res.data.token;
      if (!token) {
        setErrorMsg("Login failed: token missing.");
        return;
      }

      localStorage.setItem("token", token);

      // Save user if provided by backend
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        // optional: clear old user data
        localStorage.removeItem("user");
      }

      navigate("/dashboard");
    } catch (error) {
      // Try to show backend message if it exists
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Invalid email or password.";
      setErrorMsg(String(msg));
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p className="small-text">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
