import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Info, LogIn, UserPlus } from "lucide-react";
import { List} from "lucide-react";
function Navbar() {
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem("role"));
    };

    window.addEventListener("focus", handleStorageChange);
    return () => window.removeEventListener("focus", handleStorageChange);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#014421] z-50">

<div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between min-h-[70px]">

        {/* LOGO */}
        <div className="flex items-center gap-2">

  <h1 className="text-white text-xl md:text-2xl font-bold tracking-[2px]">
    AGRORENT
  </h1>

</div>
        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-3 text-sm md:text-base">

        <Link to="/" className="flex items-center gap-1 text-white px-3 py-1 rounded-full hover:bg-lime-300 hover:text-black transition">
  <Home size={16} />
  Home
</Link>

          {!role && (
            <>
      <Link to="/how-it-works" className="flex items-center gap-1 text-white px-3 py-1 rounded-full hover:bg-lime-300 hover:text-black transition">
  <List size={16} />
  How It Works
</Link>

<Link to="/login" className="flex items-center gap-1 text-white px-3 py-1 rounded-full hover:bg-lime-300 hover:text-black transition">
  <LogIn size={16} />
  Login
</Link>

<Link to="/register" className="flex items-center gap-1 text-white px-3 py-1 rounded-full hover:bg-lime-300 hover:text-black transition">
  <UserPlus size={16} />
  Signup
</Link>
            </>
          )}

          {role === "farmer" && (
            <>
              <Link to="/equipments" className="text-white px-3 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                Browse Equipments
              </Link>
              <Link to="/my-bookings" className="text-white px-3 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                My Bookings
              </Link>
            </>
          )}

          {role === "owner" && (
            <>
              <Link to="/add-equipment" className="text-white px-3 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                Add Equipment
              </Link>
              <Link to="/my-equipments" className="text-white px-3 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                My Equipments
              </Link>
              <Link to="/booking-requests" className="text-white px-3 py-1 rounded-full hover:bg-lime-400 hover:text-black">
                Booking Requests
              </Link>
            </>
          )}

          {role && (
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-white px-3 py-1 rounded-full hover:bg-red-500"
            >
              Logout
            </button>
          )}
        </div>

        {/* MOBILE TOP BUTTONS */}
        <div className="flex items-center gap-2 md:hidden">

          <button
            className="text-white text-xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

      </div>

      {/* MOBILE DROPDOWN */}
      {menuOpen && (
  <div className="md:hidden px-4 pb-4 flex flex-col gap-2 text-white">

    {/* HOME */}
    <Link
      to="/"
      onClick={() => setMenuOpen(false)}
      className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-lime-300 hover:text-black transition"
    >
      <Home size={16} />
      Home
    </Link>

    {!role && (
      <>
        {/* HOW IT WORKS */}
        <Link
          to="/how-it-works"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-lime-300 hover:text-black transition"
        >
          <List size={16} />
          How It Works
        </Link>

        {/* LOGIN */}
        <Link
          to="/login"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-lime-300 hover:text-black transition"
        >
          <LogIn size={16} />
          Login
        </Link>

        {/* SIGNUP */}
        <Link
          to="/register"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-lime-300 hover:text-black transition"
        >
          <UserPlus size={16} />
          Signup
        </Link>
      </>
    )}

    {/* FARMER */}
    {role === "farmer" && (
      <>
        <Link to="/equipments" onClick={() => setMenuOpen(false)} className="px-3 py-2">
          Browse Equipments
        </Link>
        <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="px-3 py-2">
          My Bookings
        </Link>
      </>
    )}

    {/* OWNER */}
    {role === "owner" && (
      <>
        <Link to="/add-equipment" onClick={() => setMenuOpen(false)} className="px-3 py-2">
          Add Equipment
        </Link>
        <Link to="/my-equipments" onClick={() => setMenuOpen(false)} className="px-3 py-2">
          My Equipments
        </Link>
        <Link to="/booking-requests" onClick={() => setMenuOpen(false)} className="px-3 py-2">
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
        className="flex items-center gap-2 px-3 py-2 text-red-300"
      >
        Logout
      </button>
    )}
  </div>
)}
    </nav>
  );
}

export default Navbar;