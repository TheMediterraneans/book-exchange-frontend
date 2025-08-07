import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/auth.services";

function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    signup(form)
      .then(() => {
        navigate("/login"); // Go to login after signup
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Signup failed.");
      });
  };

  return (
    <>
    <h1>Sign up!</h1>
    <section>
        <form onSubmit={handleSubmit}>
      
      <input 
      name= "name"
      value={form.name}
      onChange={handleChange}
      required
      />
      <input 
      name="email"
      type="email"
      placeholder="E-mail"
      value={form.email}
      onChange={handleChange}
      required
      />
      <input 
      name="password"
      type="password"
      placeholder="Password"
      value={form.password}
      onChange={handleChange}
      required
      />

      <button type="submit">Sign up</button>
    </form>
    {error && <p style={{color: "red"}}>{error}</p>}
    </section>
    </>
    
  );
}

export default SignupPage;
