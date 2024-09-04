import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import ActionButton from "../Components/ActionButton";

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
             className="bg-white shadow-green-600 shadow-lg rounded px-8 pt-6 pb-8 mb-4 max-w-md w-full"
        method="post"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <div className="mb-4 flex gap-10">
          <div className="w-1/2">
            <label htmlFor="firstName" className="block font-bold text-sm">
              First name
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              placeholder="Bob"
              onChange={handleChange}
              value={formData.firstName}
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.firstName && (
              <span className="text-red-500 text-xs mb-2 italic">{errors.firstName}</span>
            )}
          </div>
          <div className="w-1/2">
            <label htmlFor="lastName" className="block font-bold text-sm">
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              placeholder="Ross"
              onChange={handleChange}
              value={formData.lastName}
               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.lastName && (
              <span className="text-red-500 text-xs mb-2 italic">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block font-bold text-sm">
            Email
          </label>
          <input
            type="email"
            placeholder="bob@ross.com"
            name="email"
            id="email"
            onChange={handleChange}
            value={formData.email}
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.email && (
            <span className="text-red-500 text-xs mb-2 italic">{errors.email}</span>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block font-bold text-sm">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="**************"
             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.password && (
            <span className="text-red-500 text-xs mb-2 italic">{errors.password}</span>
          )}
        </div>

        {errors.general && (
          <div className="text-red-500 text-xs mb-2 italic ">{errors.general}</div>
        )}

        <div>
          <ActionButton
            loading={loading}
            loadingText={"Creating account..."}
            idleText={"Sign up"}
          />
        </div>

        <p className="mt-2">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-sm text-green-500 hover:text-green-700">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
