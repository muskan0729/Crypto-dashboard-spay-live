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
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* ========= BACKGROUND LAYERS ========= */}

      {/* Base dark */}
      <div className="absolute inset-0 bg-[#020617] -z-40"></div>

      {/* Background image (STRONG & VISIBLE) */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-60 saturate-125 contrast-110 -z-30"
        style={{ backgroundImage: `url(${paymentGatewayBg})` }}
      ></div>

      {/* Dark cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#020617]/80 via-[#020617]/60 to-[#020617]/90 -z-20"></div>

      {/* Neon blue glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.22),_transparent_65%)] -z-10"></div>

      {/* Floating glow orb */}
      <div className="absolute w-[520px] h-[520px] bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-transparent blur-3xl rounded-full top-[-120px] right-[-120px] -z-10"></div>

      {/* ========= LOGIN CARD ========= */}

      <div className="relative w-full max-w-md rounded-2xl border border-cyan-400/20 bg-white/5 backdrop-blur-2xl shadow-[0_0_80px_rgba(56,189,248,0.18)] p-8">
        {/* Soft inner glow */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none"></div>

        {/* Logo */}
        <div className="flex justify-center mb-8 relative z-10">
          <div className="rounded-xl bg-black/50 backdrop-blur-md  border-white/10 shadow-xl">
            <img
              className="w-28 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]"
              src={logo}
              alt="logo"
            />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold mb-8 text-center text-cyan-300 tracking-wide">
          Secure Login
        </h1>

        {/* ========= FORM ========= */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              required
              className="peer w-full rounded-xl bg-black/55 backdrop-blur-md
                px-4 pt-6 pb-2 text-sm text-white caret-cyan-400
                border border-white/10
                focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30
                focus:outline-none transition-all
                [-webkit-autofill]:bg-black/55
                [-webkit-autofill]:text-white
                [-webkit-autofill]:shadow-[0_0_0_30px_rgba(0,0,0,0.55)_inset"
            />
            <label
              className="absolute left-4 top-4 text-sm text-gray-400 transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
              peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-cyan-300
              peer-valid:top-1.5 peer-valid:text-xs peer-valid:text-cyan-300"
            >
              Email address
            </label>
            {error?.errors?.email && (
              <p className="mt-1 text-xs text-red-500">{error.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              required
              className="peer w-full rounded-xl bg-black/55 backdrop-blur-md
                px-4 pt-6 pb-2 text-sm text-white caret-cyan-400
                border border-white/10
                focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30
                focus:outline-none transition-all
                [-webkit-autofill]:bg-black/55
                [-webkit-autofill]:text-white
                [-webkit-autofill]:shadow-[0_0_0_30px_rgba(0,0,0,0.55)_inset"
            />
            <label
              className="absolute left-4 top-4 text-sm text-gray-400 transition-all
              peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
              peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-cyan-300
              peer-valid:top-1.5 peer-valid:text-xs peer-valid:text-cyan-300"
            >
              Password
            </label>

            <button
              type="button"
              className="absolute right-3 top-4 text-cyan-300 hover:text-white transition"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>

            {error?.errors?.password && (
              <p className="mt-1 text-xs text-red-500">
                {error.errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="relative w-full h-11 rounded-xl text-sm font-semibold text-white
              bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400
              hover:scale-[1.02]
              hover:shadow-[0_0_40px_rgba(56,189,248,0.55)]
              transition-all duration-300
              disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Signing in...
              </span>
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
