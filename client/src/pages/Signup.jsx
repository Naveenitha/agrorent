import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "farmer",
    location: ""
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

      await registerUser(formData);

      navigate("/login");

    } catch (err) {

      setError(
        err.response?.data?.message || "Signup failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">

      <div className="bg-white/95 backdrop-blur-sm w-full max-w-sm mx-4 rounded-xl shadow-lg p-5">

        <h1 className="text-2xl font-bold text-green-600 mb-1 text-center">
          AGRORENT
        </h1>

        <p className="text-gray-600 mb-4 text-center text-sm">
          Create your account
        </p>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-xs text-gray-600 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

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

          <div>
            <label className="text-xs text-gray-600 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

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

          <div>
            <label className="text-xs text-gray-600 font-medium">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="farmer">Farmer</option>
              <option value="owner">Equipment Owner</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 font-medium">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter your location"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#78A91E] text-white py-3 rounded-lg font-semibold hover:bg-[#6c9919] transition"
          >
            {loading ? "Creating Account..." : "SIGN UP"}
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-700 font-medium hover:underline"
            >
              Login
            </Link>
          </p>

        </form>

      </div>

    </div>
  );
}

export default Signup;