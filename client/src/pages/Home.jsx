import { useState, useEffect } from "react";
import homeBg from "../assets/home.jpg";
import TractorImg from "../assets/tractor.jpg";
import HarvesterImg from "../assets/harvestor.jpg";
import RotavatorImg from "../assets/rotavator.jpg";
import PloughsImg from "../assets/ploughs.jpg";
function Home() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${homeBg})` }}
      >
        <div className="flex flex-col items-center justify-center min-h-screen pt-32 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Smart Farming Starts Here
          </h1>
          <p className="text-gray-100 text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            AgroRent helps farmers access modern agricultural equipment quickly and affordably.
            By connecting equipment owners and farmers, we make farming more efficient,
            productive, and cost-effective.
          </p>
        </div>
      </div>

    {/* Equipment Categories Section */}
<section className="bg-green-950 py-28">

<div className="max-w-6xl mx-auto px-6">

  {/* Section Header */}
  <div className="mb-16 text-white">

    <h2 className="text-4xl md:text-5xl font-bold mb-4">
      Explore Equipment Categories
    </h2>

    <p className="text-green-200 max-w-2xl">
      Browse different agricultural machines available for rent and
      choose the equipment that fits your farming needs.
    </p>

  </div>

  {/* Cards */}
  <div className="grid md:grid-cols-2 gap-10">

    {/* Tractor */}
    <div className="bg-green-900 rounded-2xl overflow-hidden hover:scale-[1.02] transition">

      <img
        src={TractorImg}
        alt="Tractors"
        className="w-full h-60 object-cover"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Tractors
        </h3>

        <p className="text-green-200">
          Powerful tractors available for plowing, tilling,
          and heavy agricultural tasks.
        </p>
      </div>

    </div>

    {/* Rotavators */}
    <div className="bg-green-900 rounded-2xl overflow-hidden hover:scale-[1.02] transition">

      <img
        src={RotavatorImg}
        alt="Rotavators"
        className="w-full h-60 object-cover"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Rotavators
        </h3>

        <p className="text-green-200">
          Rotavators help prepare soil quickly for planting
          and improve crop productivity.
        </p>
      </div>

    </div>

    {/* Harvesters */}
    <div className="bg-green-900 rounded-2xl overflow-hidden hover:scale-[1.02] transition">

      <img
        src={HarvesterImg}
        alt="Harvesters"
        className="w-full h-60 object-cover"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Harvesters
        </h3>

        <p className="text-green-200">
          Efficient harvesting machines that save time and
          reduce manual labor.
        </p>
      </div>

    </div>

    {/* Plough */}
    <div className="bg-green-900 rounded-2xl overflow-hidden hover:scale-[1.02] transition">

      <img
        src={PloughsImg}
        alt="Ploughs"
        className="w-full h-60 object-cover"
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          Ploughs
        </h3>

        <p className="text-green-200">
          Reliable ploughs for soil turning and preparing
          farmland for cultivation.
        </p>
      </div>

    </div>

  </div>

</div>

</section>
{/* AgroRent Impact Section */}
<section className="bg-green-950 py-28 border-t-1 border-green-900">

  <div className="max-w-6xl mx-auto text-center px-6">

    {/* Title */}
    <h2 className="text-4xl font-bold text-white mb-6">
      AgroRent Impact
    </h2>

    <p className="text-green-200 max-w-2xl mx-auto mb-20">
      Our platform is helping farmers and equipment owners connect
      and improve agricultural productivity.
    </p>

    {/* Stats */}
    <div className="grid md:grid-cols-4 gap-10">

      <div>
        <h3 className="text-5xl font-bold text-white">500+</h3>
        <p className="text-green-200 mt-2">Equipments Available</p>
      </div>

      <div>
        <h3 className="text-5xl font-bold text-white">120+</h3>
        <p className="text-green-200 mt-2">Equipment Owners</p>
      </div>

      <div>
        <h3 className="text-5xl font-bold text-white">800+</h3>
        <p className="text-green-200 mt-2">Farmers Using Platform</p>
      </div>

      <div>
        <h3 className="text-5xl font-bold text-white">2000+</h3>
        <p className="text-green-200 mt-2">Successful Rentals</p>
      </div>

    </div>

  </div>

</section>

{/* Call To Action Section */}
<section className="bg-green-950 py-24 text-center text-white border-t-1 border-green-900">

  <div className="max-w-4xl mx-auto px-6">

    <h2 className="text-4xl font-bold mb-6">
      Start Renting Equipment Today
    </h2>

    <p className="text-lg mb-10 text-green-200">
      Join AgroRent and access modern agricultural equipment easily.
      Save money, increase productivity, and simplify your farming operations.
    </p>

    <div className="flex justify-center gap-6 flex-wrap">

      <a
        href="/signup"
        className="bg-white text-green-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
      >
        Sign Up
      </a>

      <a
        href="/equipments"
        className="border border-green-300 px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-900 transition"
      >
        Browse Equipments
      </a>

    </div>

  </div>

</section>
{/* Footer Section */}
<section id="footer" className="bg-green-900 border-t border-green-800 text-white">

  <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

    {/* About */}
    <div>
      <h2 className="text-2xl font-bold mb-4">AgroRent</h2>
      <p className="text-green-200">
        AgroRent connects farmers with equipment owners to make
        agriculture more efficient and affordable.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="font-semibold text-lg mb-4">Quick Links</h3>

      <ul className="space-y-2 text-green-200">
        <li><a href="/" className="hover:text-white">Home</a></li>
        <li><a href="/equipments" className="hover:text-white">Equipments</a></li>
        <li><a href="/how-it-works" className="hover:text-white">How It Works</a></li>
        <li><a href="/contact" className="hover:text-white">Contact</a></li>
      </ul>
    </div>

    {/* Services */}
    <div>
      <h3 className="font-semibold text-lg mb-4">Services</h3>

      <ul className="space-y-2 text-green-200">
        <li>Rent Equipment</li>
        <li>List Equipment</li>
        <li>Manage Bookings</li>
        <li>Customer Support</li>
      </ul>
    </div>

    {/* Contact */}
    <div>
      <h3 className="font-semibold text-lg mb-4">Contact</h3>

      <p className="text-green-200">📍 India</p>
      <p className="text-green-200">📧 agrorent@gmail.com</p>
      <p className="text-green-200">📞 +91 6281377024</p>
      <div className="mt-3 flex gap-3">
        <a href="https://linkedin.com/in/agrorent" target="_blank" rel="noopener noreferrer" className="text-green-200 hover:text-white">
          LinkedIn
        </a>
        <span className="text-green-200">|</span>
        <a href="https://instagram.com/agrorent" target="_blank" rel="noopener noreferrer" className="text-green-200 hover:text-white">
          Instagram
        </a>
      </div>
    </div>

  </div>

  {/* Bottom Copyright */}
  <div className="border-t border-green-800 py-6 text-center text-green-300 text-sm">
    © {new Date().getFullYear()} AgroRent. All rights reserved.
  </div>

</section>
    </div>
  );
}

export default Home;
