import { useState } from "react";
import { useAuth } from "../contexts/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import ActionButton from "../Components/ActionButton";
import { Mail, KeyRound, CircleUserRound } from "lucide-react";
import loginBackground from "../assets/login-background.webp";

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
    <main className="flex  justify-center items-center bg-gray-900  min-h-screen  bg-gradient-to-br from-green-400 to-blue-500 gap-20 ">
      <form
        className="bg-white  shadow-lg  px-8 pt-6 pb-8 mb-4 max-w-md w-full rounded-lg"
        method="post"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <div className="mb-4 flex gap-10 relative">
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
              className="shadow appearance-none border rounded w-full pl-9 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.firstName && (
              <span className="text-red-500 text-xs mb-2 italic">
                {errors.firstName}
              </span>
            )}
            <CircleUserRound
              className="absolute left-3 top-[29px]  text-gray-400"
              size={20}
            />
          </div>
          <div className="w-1/2 relative">
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
              className="shadow appearance-none border rounded w-full py-2 pl-9 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.lastName && (
              <span className="text-red-500 text-xs mb-2 italic">
                {errors.lastName}
              </span>
            )}
            <CircleUserRound
              className="absolute left-3 top-[29px]  text-gray-400"
              size={20}
            />
          </div>
        </div>

        <div className="mb-4 relative">
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
            className="shadow appearance-none border rounded w-full py-2 pl-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.email && (
            <span className="text-red-500 text-xs mb-2 italic">
              {errors.email}
            </span>
          )}
          <Mail
            className="absolute left-3 top-[30px]  text-gray-400"
            size={19}
          />
        </div>

        <div className="mb-4 relative">
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
            className="shadow appearance-none border rounded w-full  pl-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.password && (
            <span className="text-red-500 text-xs mb-2 italic">
              {errors.password}
            </span>
          )}
          <KeyRound
            className="absolute left-3 top-[30px]  text-gray-400"
            size={19}
          />
        </div>

        {errors.general && (
          <div className="text-red-500 text-xs mb-2 italic ">
            {errors.general}
          </div>
        )}

        <div>
          <ActionButton
            loading={loading}
            loadingText={"Creating account..."}
            idleText={"Sign up"}
          />
        </div>

        <p className="mt-2 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-sm  text-green-500 hover:text-green-700"
          >
            Log in
          </Link>
        </p>
      </form>
      <img
        src="https://res.cloudinary.com/dy0av590l/image/upload/v1729485725/rb_2148561973_oaskxg.webp"
        className="h-[800px] w-auto"
      />
    </main>
  );
}
