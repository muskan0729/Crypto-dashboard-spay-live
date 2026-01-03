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

      if (response) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("email", response.user.email);
        localStorage.setItem("role", btoa(response.user.role_type));
        localStorage.setItem("user", JSON.stringify(response.user));
        navigate("/krypto-dashboard", { replace: true });
      }
    } catch (err) {
      console.log("Login failed:", err);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 bg-black/75 overflow-hidden">
      {/* Warm Gradient Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-600/30 via-orange-500/20 to-yellow-400/10 -z-10"></div>

      {/* Optional Background Image Overlay */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-10 -z-10"
        style={{ backgroundImage: `url(${paymentGatewayBg})` }}
      ></div>

      {/* Outer Glow */}
      <div className="absolute w-[420px] h-[420px] bg-gradient-to-br from-red-500/30 via-orange-400/20 to-yellow-300/10 blur-3xl rounded-full -z-10"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black/5 backdrop-blur-xl shadow-xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="rounded-xl bg-black/40 backdrop-blur-md px-6 py-3 border border-black/10">
            <img className="w-28" src={logo} alt="logo" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold mb-6 text-center text-[#FFD700]">
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
              className={`peer w-full rounded-xl bg-black/40 backdrop-blur-md
                px-4 pt-5 pb-2 text-sm text-white
                border focus:outline-none placeholder-transparent
                ${
                  error?.errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-[#FFD700]"
                }`}
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-1.5 z-10 text-xs text-[#FFD700] bg-black/70 px-2 rounded"
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
              className={`peer w-full rounded-xl bg-black/40 backdrop-blur-md
                px-4 pt-5 pb-2 text-sm text-white
                border focus:outline-none placeholder-transparent
                ${
                  error?.errors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-white/10 focus:border-[#FFD700]"
                }`}
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-1.5 z-10 text-xs text-[#FFD700] bg-black/70 px-2 rounded transition-all"
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
            className="inline-flex items-center justify-center w-full h-10 gap-2 px-4 rounded-xl text-sm font-medium text-black
              bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400
              hover:from-red-600 hover:via-orange-500 hover:to-yellow-500
              shadow-lg shadow-yellow-400/25 transition-all
              disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
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
