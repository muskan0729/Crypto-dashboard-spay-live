import { useState } from "react";
import logo from "../images/logo.png";
import paymentGatewayBg from "../images/lgoinbg.jpg";
import { usePost } from "../hooks/usePost";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const { execute: login, error, loading } = usePost("/login");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      console.log(response.user.role_type);

      if (response) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("email", response.user.email);
        localStorage.setItem("role", btoa(response.user.role_type));
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.log("Login failed:", err);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 bg-black overflow-hidden">
      {/* Gradient Background */}
      {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-purple-900/20 to-[#1174bd]"></div> */}
<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#117fc2]/50 via-[#0f6fb5]/30 to-[#064c97]"></div>

      {/* Optional Background Image Overlay */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-10"
        style={{ backgroundImage: `url(${paymentGatewayBg})` }}
      ></div>

      {/* Outer Glow */}
      <div className="absolute w-[420px] h-[420px] bg-gradient-to-br from-purple-600/30 to-indigo-600/30 blur-3xl rounded-full"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="rounded-xl bg-black/40 backdrop-blur-md px-6 py-3 border border-white/10">
            <img className="w-28" src={logo} alt="logo" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Sign in to your account
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className={`peer w-full rounded-lg bg-black/40 backdrop-blur-md
            px-4 pt-5 pb-2 text-sm text-white
            border focus:outline-none placeholder-transparent
            ${
              error?.errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-white/10 focus:border-indigo-500"
            }`}
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-1.5 z-10
            text-xs text-indigo-400
            bg-black/70 px-4 rounded
            "
            >
              Email
            </label>
            {error?.errors.email && (
              <p className="mt-1 text-xs text-red-500">{error.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className={`peer w-full rounded-lg bg-black/40 backdrop-blur-md
            px-4 pt-5 pb-2 text-sm text-white
            border focus:outline-none placeholder-transparent
            ${
              error?.errors.password
                ? "border-red-500 focus:border-red-500"
                : "border-white/10 focus:border-indigo-500"
            }`}
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-1.5 z-10
            text-xs text-indigo-400
            bg-black/70 px-1 rounded
            transition-all
            "
            >
              Password
            </label>

            {/* Toggle Password */}
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-400 hover:text-white transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

            {error?.errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {error.errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="
          inline-flex items-center justify-center whitespace-nowrap rounded-md
          text-sm font-medium transition-all disabled:pointer-events-none
          disabled:opacity-50 w-full gap-2 h-10 px-4
          bg-gradient-to-r from-blue-600 to-purple-600
          hover:from-blue-700 hover:to-purple-700
          shadow-lg shadow-blue-500/25
          text-white
          focus-visible:ring-2 focus-visible:ring-purple-500
        "
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginForm;
