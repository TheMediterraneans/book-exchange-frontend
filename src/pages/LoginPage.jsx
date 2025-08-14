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
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '80vh',
      padding: '2rem 1rem'
    }}>
      <div style={{
        backgroundColor: 'rgb(17, 24, 39)', // bg-gray-900
        borderRadius: '1rem', // rounded-xl
        border: '1px solid rgb(31, 41, 55)', // border-gray-800
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
          Login
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <input
              name="email"
              type="email"
              placeholder="User E-mail"
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
              placeholder="Enter your Password"
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
              backgroundColor: loading ? 'rgb(193, 93, 65, 1)' : 'rgb(168, 85, 247)',
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
            {loading ? "Logging in..." : "Login"}
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
          Don't have an account?{' '}
          <a 
            href="/signup"
            style={{
              color: 'rgb(193, 93, 65, 1)',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
export default LoginPage;
