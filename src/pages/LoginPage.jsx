import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { login as loginService, verify } from "../services/auth.services";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginService(form);
      const token = response.data.authToken;

      localStorage.setItem("authToken", token);

      // get user data and update context
      const userResponse = await verify();
      login(userResponse.data);

      navigate("/all-books");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <article>
          <input
            name="email"
            type="email"
            placeholder="User E-mail"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </article>
        <article>
          <input
            name="password"
            type="password"
            placeholder="Enter your Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </article>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <p>
        Don't have an account? <a href="/signup">Sign up here</a>
      </p>
    </section>
  );
}

export default LoginPage;
