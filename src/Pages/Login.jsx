import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import { validateLoginForm } from "../utils/loginValidation";
import useTitle from "../hooks/useTitle";
import ActionButton from "../Components/ActionButton";
import { Mail, KeyRound } from "lucide-react";

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

  async function demo() {
    const demoEmails = ["sarah.demo@example.com", "james.demo@example.com"];

    const randomDemoEmail =
      demoEmails[Math.floor(Math.random() * demoEmails.length)];

    setEmail(randomDemoEmail);
    setPassword("demo123");
    const credentials = { email: randomDemoEmail, password: "demo123" };
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
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-400 to-blue-500 login gap-20 ">
      <div className="w-full max-w-md bg-white border-gray-200 border shadow-lg rounded-lg ">
        <form
          onSubmit={handleSubmit}
          className="bg-white  rounded px-8 pt-6 pb-4 mb-4"
        >
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Log in
          </h1>
          <div className="mb-4 relative">
            <label className="block text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="email"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
            {error.email && (
              <p className="text-red-500 text-xs italic mt-1">Invalid Email</p>
            )}
            <Mail
              className="absolute left-3 top-[38px]  text-gray-400"
              size={19}
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 pl-10 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
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
            <KeyRound
              className="absolute left-3 top-[38px]  text-gray-400"
              size={19}
            />
          </div>
          {error.general && (
            <div className="text-red-500 text-sm mb-4">{error.general}</div>
          )}
          <div className="flex flex-col items-center justify-between">
            <ActionButton
              loading={loading}
              loadingText={"Logging in..."}
              idleText={"Log in"}
            />

            <button
              onClick={demo}
              type="button"
              disabled={loading}
              className=" w-full mt-2 className={`w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed `}"
            >
              {loading ? "Logging in as demo user..." : "Try the Live Demo"}
            </button>
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
      <div className="relative hidden md:block  w-full max-w-[800px] h-auto aspect-[4/4] ">
        <img
          src="https://res.cloudinary.com/dy0av590l/image/upload/v1729485725/rb_2148561973_oaskxg.webp"
          alt="Login background"
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
    </main>
  );
}
