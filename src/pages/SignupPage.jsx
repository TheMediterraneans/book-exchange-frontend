import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/auth.services";

function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // clean error hen start typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(form);
      setSuccess(true);
      
      // Show success messge for 2 sec then go to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <>
        <h1>Signed up!</h1>
        <p>Account created, you'll be redirected to the login page...</p>
      </>
    );
  }

  return (
    <>
      <h1>Sign up!</h1>
      <section>
        <form onSubmit={handleSubmit}>
          <article>
            <input 
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-500"
            name="name"
            type="text"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
          </article>
          
          <article>
            <input 
            className="w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-500"
            name="email"
            type="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          </article>
          
          <article>
            <input 
            className="rounded border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime-500"
            name="password"
            type="password"
            placeholder="Password (min 6 characters, at least 1 capital letter, and a number)"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          </article>
          
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
        
        {error && <p style={{color: "red"}}>{error}</p>}
        
        <p>
          You already have an account? <a href="/login">Accedi qui</a>
        </p>
      </section>
    </>
  );
}

export default SignupPage;