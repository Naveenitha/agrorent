import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/authService";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const data = await loginUser(formData);

      // store authentication data
      localStorage.setItem("token", data.token);
      
      // store user role - handle different response structures
      const userRole = data.user?.role || data.role || data.user?.user?.role;
      if (userRole) {
        localStorage.setItem("role", userRole);
      }
      
      // store user name if available
      if (data.user?.name) {
        localStorage.setItem("name", data.user.name);
      }


      // Reload page to update navbar with new role
      window.location.href = "/";

    } catch (err) {

      setError(
        err.response?.data?.message || "Login failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">

      <div className="bg-white/95 backdrop-blur-sm w-full max-w-sm mx-4 rounded-xl shadow-lg p-5">

        {/* Logo */}
        <h1 className="text-2xl font-bold text-green-600 mb-1 text-center">
          AGRORENT
        </h1>

        <p className="text-gray-600 mb-4 text-center text-sm">
          Welcome back! Login to your account
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* Email */}
          <div>
            <label className="text-xs text-gray-600 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-600 font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#78A91E] text-white py-2 rounded-lg mt-4 font-semibold hover:bg-[#6c9919] transition duration-300 text-sm disabled:opacity-50"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-700 font-medium hover:underline"
            >
              Signup
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}

export default Login;