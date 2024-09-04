import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { validateLoginForm } from "../utils/loginValidation";
import useTitle from "../hooks/useTitle";
import ActionButton from "../Components/ActionButton";

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
    const credentials = { email, password };
    try {
      await login(credentials);
      navigate("/chats", { replace: true });
    } catch (err) {
      setError((prev) => ({
        ...prev,
        general: err.message || "Failed to log in. Please try again.",
      }));
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-200 via-green-400 to-green-600 ">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-green-600 shadow-lg rounded px-8 pt-6 pb-8 mb-4"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Log in
          </h1>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            {error.email && (
              <p className="text-red-500 text-xs italic mt-1">Invalid Email</p>
            )}
          </div>
          <div className="">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
            />
            {error.password && (
              <p className="text-red-500 text-xs mb-2 italic">
                Password must be at least 6 characters
              </p>
            )}
          </div>
          {error.general && (
            <div className="text-red-500 text-sm mb-4">{error.general}</div>
          )}
          <div className="flex flex-col items-center justify-between">
           <ActionButton loading={loading} 
           loadingText={"Logging in..."}
           idleText={"Log in"}
            />
            <div className="mt-2">
              No account?{" "}
              <Link
                className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-green-700"
                to="/sign-up"
              >
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
