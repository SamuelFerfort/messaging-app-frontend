import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const { register, loading } = useAuth();
  useTitle("Sign Up");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.includes("@"))
      newErrors.email = "Invalid email address";
    if (formData.password.length < 8)
      newErrors.password = "Password length must be at least 8 characters long";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log(formData);
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err.message || "Failed to register. Please try again.",
      }));
    }
  };
  return (
    <main className="flex  justify-center items-center bg-gray-900  min-h-screen  bg-gradient-to-r from-green-300 via-green-500 to-green-700">
      <form
        className=" max-w-md bg-gray-800 p-8 rounded-lg h-full" 
        method="post"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-100">Sign Up</h1>

        <div className="mb-4 flex gap-10">
          <div className="w-1/2">
            <label htmlFor="firstName" className="block text-gray-300">
              First name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              onChange={handleChange}
              value={formData.firstName}
              className="w-full p-2 mt-2 border border-gray-700 rounded bg-gray-700 text-gray-100"
            />
            {errors.firstName && (
              <span className="text-red-400 text-sm">{errors.firstName}</span>
            )}
          </div>
          <div className="w-1/2">
            <label htmlFor="lastName" className="block text-gray-300">
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              onChange={handleChange}
              value={formData.lastName}
              className="w-full p-2 mt-2 border border-gray-700 rounded bg-gray-700 text-gray-100"
            />
            {errors.lastName && (
              <span className="text-red-400 text-sm">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            value={formData.email}
            className="w-full p-2 mt-2 border border-gray-700 rounded bg-gray-700 text-gray-100"
          />
          {errors.email && (
            <span className="text-red-400 text-sm">{errors.email}</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
            className="w-full p-2 mt-2 border border-gray-700 rounded bg-gray-700  text-gray-100"
          />
          {errors.password && (
            <span className="text-red-400 text-sm">{errors.password}</span>
          )}
        </div>

        {errors.general && (
          <div className="text-red-400 text-sm mb-4">{errors.general}</div>
        )}
        {loading && <div className="text-gray-400 mb-4">Loading...</div>}

        <div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700 transition duration-300"
          >
            Sign Up
          </button>
        </div>

        <p className="mt-4 text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </main>
  );
}
