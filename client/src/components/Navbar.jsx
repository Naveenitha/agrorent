import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const [role, setRole] = useState(localStorage.getItem("role"));
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Listen for storage changes (for when user logs in from another component)
  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };

    // Check role on mount and when window regains focus
    window.addEventListener("focus", handleStorageChange);
    
    return () => {
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  return (

    <nav className="absolute top-4 left-0 w-full flex justify-center z-50">

      <div className="w-[90%] flex items-center justify-between">

        <h1 className="text-white text-xl font-semibold tracking-wider">
          AGRORENT
        </h1>

        <div className="bg-green-900/80 backdrop-blur-md px-5 py-2 rounded-full flex items-center space-x-3 text-base">

          <Link to="/" className="text-white px-4 py-1 rounded-full hover:bg-lime-400 hover:text-black transition">
            Home
          </Link>

          {/* NOT LOGGED IN */}
          {!role && (
            <>
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search equipment..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      navigate(`/equipments?search=${encodeURIComponent(searchQuery.trim())}`);
                    }
                  }}
                  className="bg-white text-black placeholder-gray-500 px-3 py-1 rounded-full text-sm border border-gray-300 focus:outline-none focus:border-lime-400 w-56"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <Link to="/how-it-works" className="text-white px-4 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                How It Works
              </Link>

              <Link to="/login" className="text-white px-4 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                Login
              </Link>

              <Link to="/register" className="text-white px-4 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                Signup
              </Link>
            </>
          )}

          {/* FARMER MENU */}
          {role === "farmer" && (
            <>
              <Link to="/equipments" className="text-white px-4 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                Browse Equipments
              </Link>

              <Link to="/my-bookings" className="text-white px-4 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                My Bookings
              </Link>
            </>
          )}

          {/* OWNER MENU */}
          {role === "owner" && (
            <>
              <Link to="/add-equipment" className="text-white px-4 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                Add Equipment
              </Link>

              <Link to="/my-equipments" className="text-white px-4 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                My Equipments
              </Link>

              <Link to="/booking-requests" className="text-white px-4 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                Booking Requests
              </Link>
            </>
          )}

          {/* LOGOUT */}
          {role && (
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-white px-4 py-1 rounded-full hover:bg-red-500"
            >
              Logout
            </button>
          )}

        </div>

        <a href="/#footer" className="bg-lime-400 text-black text-base px-4 py-2 rounded-full flex items-center gap-2 font-medium hover:bg-lime-300 transition">
          Contact Us
        </a>

      </div>

    </nav>
  );
}

export default Navbar;