import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { validateLoginForm } from "../utils/loginValidation";
import useTitle from "../hooks/useTitle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: false,
    password: false,
    general: false,
  });

  const { loading, login } = useAuth();

  useTitle("Log in");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError({ email: false, password: false, general: "" });
    const { isValid, errors } = validateLoginForm(email, password);

    if (!isValid) return setError((prev) => ({ ...prev, ...errors }));

    try {
      await login();
      navigate("/chats", {replace: true});
    } catch (err) {}
    setError((prev) => ({
      ...prev,
      general: err.message || "Failed to log in. Please try again.",
    }));
  }

  return (
    <main className="flex justify-center h-screen items-center">
      <form onSubmit={handleSubmit}>
        <h1 className="text-2xl mb-6 ">Log in</h1>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {error.email && (
            <span className="text-red-400 text-sm">Invalid Email</span>
          )}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {error.password && (
            <span className="text-red-400 text-sm">
              Password must be at least 6 characters
            </span>
          )}
        </div>
        {error.general && (
          <div className="text-red-400 text-sm mb-4">{error.general}</div>
        )}
        {loading && <div className="text-gray-400 mb-4">Loading...</div>}
        <p>
          No account? <Link to={"/sign-up"} />
          Sign up
        </p>
      </form>
    </main>
  );
}
