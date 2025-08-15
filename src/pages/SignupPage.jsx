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
    // clean error then start typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signup(form);
      setSuccess(true);
      
      // show success message for 2 sec then go to login
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: 'rgb(209, 213, 219)'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Signed up!</h1>
        <p style={{ fontSize: '1.125rem' }}>Account created, you'll be redirected to the login page...</p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: 'rgb(17, 24, 39)',
        borderRadius: '1rem',
        border: '1px solid rgb(31, 41, 55)',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '2rem',
          color: 'white'
        }}>
          Sign up!
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgb(0, 0, 0)',
                border: '1px solid rgb(75, 85, 99)',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgb(168, 85, 247)'}
              onBlur={(e) => e.target.style.borderColor = 'rgb(75, 85, 99)'}
            />
          </div>

          <div>
            <input
              name="email"
              type="email"
              placeholder="E-mail"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgb(0, 0, 0)',
                border: '1px solid rgb(75, 85, 99)',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgb(168, 85, 247)'}
              onBlur={(e) => e.target.style.borderColor = 'rgb(75, 85, 99)'}
            />
          </div>

          <div>
            <input
              name="password"
              type="password"
              placeholder="Password (min 6 characters, at least 1 capital letter, and a number)"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                backgroundColor: 'rgb(0, 0, 0)',
                border: '1px solid rgb(75, 85, 99)',
                borderRadius: '0.5rem',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgb(168, 85, 247)'}
              onBlur={(e) => e.target.style.borderColor = 'rgb(75, 85, 99)'}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: loading ? 'rgb(107, 114, 128)' : 'rgb(168, 85, 247)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>

        {error && (
          <p style={{
            color: 'rgb(248, 113, 113)',
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </p>
        )}

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: 'rgb(209, 213, 219)',
          fontSize: '0.875rem'
        }}>
          You already have an account?{' '}
          <a 
            href="/login"
            style={{
              color: 'rgb(168, 85, 247)',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;