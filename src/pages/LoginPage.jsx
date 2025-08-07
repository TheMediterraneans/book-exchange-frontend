import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, setToken } from "../services/auth.services.js";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // clean error when start typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(form);
      const token = response.data.authToken;

      setToken(token); //  save the token
      navigate("/mybooks"); // Navigate to the protected page
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
          />

          <input
            name="password"
            type="password"
            placeholder="Enter your Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        
        <p>
          Non hai un account? <a href="/signup">Registrati qui</a>
        </p>
      </section>
    </>
  );
}

export default LoginPage;