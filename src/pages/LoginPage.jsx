import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDEfault();

    login(form)
      .then((res) => {
        const token = res.data.authToken;

        // Save token to localStorage (or cookie)
        localStorage.setItem("authToken", token);

        // Optionally store it in state (e.g., App)
        setToken(token);

        navigate("/profile"); // or wherever you want
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Login failed.");
      });
  };

  return (
    <>
      <h1>Login</h1>
      <section>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="User E-mail"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Enter your Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      </section>
    </>
  );
}

export default LoginPage