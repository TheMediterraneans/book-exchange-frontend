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

      // Check if there's a stored redirect location (from BookDetailPage)
      const redirectLocation = sessionStorage.getItem('redirectAfterLogin');
      if (redirectLocation) {
        sessionStorage.removeItem('redirectAfterLogin'); // Clean up
        navigate(redirectLocation);
      } else {
        navigate("/mybooks");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="container-form">
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <article>
          <input
            className="input-form"
            //className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-500"
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
            className="input-form"
            //className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-500"
            name="password"
            type="password"
            placeholder="Enter your Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </article>

        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <p className="already-account">
        Don't have an account? <a href="/signup" className="access-here">Sign up here</a>
      </p>
      </div>
    </section>
  );
}

export default LoginPage;
