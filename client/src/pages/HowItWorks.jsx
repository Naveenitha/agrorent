import signupasFarmerImg from "../assets/signupasfarmer.png";
import loginImg from "../assets/login.png";
import browseImg from "../assets/browse.png";
import availabilityImg from "../assets/availability.png";
import paymentImg from "../assets/payment.png";
import bookingStatusImg from "../assets/mybookings.png";
import addEquipmentImg from "../assets/addequipment.png";
import myEquipmentsImg from "../assets/myequipments.png";
import bookingRequestsImg from "../assets/bookingrequests.png";
import logoutImg from "../assets/logout.png";
import ownerLogoutImg from "../assets/logoutasowner.png";
function HowItWorks() {
  return (
    <div className="min-h-screen bg-gray-100 py-24 mt-10">

      <div className="max-w-6xl mx-auto grid grid-cols-2 gap-12 items-start relative">

        {/* TIMELINE LINE */}
        <div className="absolute left-1/2 top-0 h-full w-1 bg-gray-300 transform -translate-x-1/2"></div>

        {/* STEP 1 IMAGE */}
        <div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
          <img src={signupasFarmerImg} alt="Signup" className="rounded-lg w-full" />
        </div>

        {/* STEP 1 */}
        <div className="relative pl-10 mb-20">
          <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

          <h2 className="text-2xl font-semibold mb-2">Create an Account</h2>

          <p className="text-gray-600">
            Sign up quickly with your email to start exploring available
            agricultural equipments near your location.
          </p>
        </div>

        {/* STEP 2 IMAGE */}
        <div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
          <img src={signupasFarmerImg} alt="Farmer Signup" className="rounded-lg w-full" />
        </div>

        {/* STEP 2 */}
        <div className="relative pl-10 mb-20">
          <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

          <h2 className="text-2xl font-semibold mb-2">Signup as Farmer</h2>

          <p className="text-gray-600">
            Farmers can sign up and create their AgroRent account to browse
            available equipment like tractors, rotavators and harvesters.
          </p>
        </div>

        {/* STEP 3 IMAGE */}
        <div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
          <img src={loginImg} alt="Login Farmer" className="rounded-lg w-full" />
        </div>

        {/* STEP 3 */}
        <div className="relative pl-10 mb-20">
          <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

          <h2 className="text-2xl font-semibold mb-2">Login as Farmer</h2>

          <p className="text-gray-600">
            Farmers can login to browse available equipment and send booking
            requests.
          </p>
        </div>

        {/* STEP 4 IMAGE */}
        <div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
          <img src={browseImg} alt="Browse Equipments" className="rounded-lg w-full" />
        </div>

        {/* STEP 4 */}
        <div className="relative pl-10">
          <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

          <h2 className="text-2xl font-semibold mb-2">Browse Equipments</h2>

          <p className="text-gray-600">
            Farmers can explore different agricultural machines such as
            tractors, rotavators, harvesters and select equipment available
            for rent near their location.
          </p>
        </div>
        {/* STEP 5 IMAGE */}
<div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
  <img src={availabilityImg} alt="Check Availability" className="rounded-lg w-full" />
</div>

{/* STEP 5 */}
<div className="relative pl-10 mb-20">
  <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

  <h2 className="text-2xl font-semibold mb-2">
    Check Availability & Select Rental Time
  </h2>

  <p className="text-gray-600">
    Farmers can check whether the selected equipment is available,
    choose the rental date, start time and number of hours,
    then proceed with the booking request.
  </p>
</div>
{/* STEP 6 IMAGE */}
<div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
  <img src={paymentImg} alt="Payment and Booking" className="rounded-lg w-full" />
</div>

{/* STEP 6 */}
<div className="relative pl-10">
  <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

  <h2 className="text-2xl font-semibold mb-2">
    Choose Payment Method & Book Equipment
  </h2>

  <p className="text-gray-600">
    Select your preferred payment method and confirm the booking
    to successfully rent the equipment for your farming needs.
  </p>
</div>
{/* STEP 7 IMAGE */}
<div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
  <img src={bookingStatusImg} alt="My Bookings" className="rounded-lg w-full" />
</div>

{/* STEP 7 */}
<div className="relative pl-10">
  <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

  <h2 className="text-2xl font-semibold mb-2">
    Check Booking Status
  </h2>

  <p className="text-gray-600">
    Farmers can visit the "My Bookings" section to track their
    equipment booking status, view booking details, and monitor
    whether the request is pending, confirmed, or completed.
  </p>
</div>
{/* STEP IMAGE */}
<div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
  <img src={logoutImg} alt="Logout" className="rounded-lg w-full" />
</div>

{/* STEP */}
<div className="relative pl-10 mb-20">
  <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

  <h2 className="text-2xl font-semibold mb-2">
    Logout
  </h2>

  <p className="text-gray-600">
    After completing the booking, farmers can logout securely from
    their AgroRent account.
  </p>
</div>
{/* STEP IMAGE */}
<div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
  <img src={loginImg} alt="Login as Owner" className="rounded-lg w-full" />
</div>

{/* STEP */}
<div className="relative pl-10 mb-20">
  <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

  <h2 className="text-2xl font-semibold mb-2">
    Login as Owner
  </h2>

  <p className="text-gray-600">
    Equipment owners can login to their AgroRent account to manage
    equipment listings and handle farmer booking requests.
  </p>
</div>
{/* STEP IMAGE */}
<div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
  <img src={addEquipmentImg} alt="Add Equipment" className="rounded-lg w-full" />
</div>

{/* STEP */}
<div className="relative pl-10 mb-20">
  <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

  <h2 className="text-2xl font-semibold mb-2">
    Add Equipment
  </h2>

  <p className="text-gray-600">
    Equipment owners can add their agricultural machines such as
    tractors, rotavators, harvesters, and ploughs by providing
    equipment details, rental price, location,availability dates and times,description and images.
  </p>
</div>
{/* STEP IMAGE */}
<div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
  <img src={myEquipmentsImg} alt="My Equipments" className="rounded-lg w-full" />
</div>

{/* STEP */}
<div className="relative pl-10 mb-20">
  <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

  <h2 className="text-2xl font-semibold mb-2">
    Check & Manage My Equipments
  </h2>

  <p className="text-gray-600">
    Equipment owners can view all their listed machines in the
    "My Equipments" section. Owners can edit equipment details,
    update rental prices, or remove equipment listings whenever needed.
  </p>
</div>
{/* STEP IMAGE */}
<div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
  <img src={bookingRequestsImg} alt="Manage Booking Requests" className="rounded-lg w-full" />
</div>

{/* STEP */}
<div className="relative pl-10 mb-20">
  <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

  <h2 className="text-2xl font-semibold mb-2">
    Manage Booking Requests
  </h2>

  <p className="text-gray-600">
    Equipment owners can view booking requests sent by farmers.
    Owners can approve or reject requests and manage rental
    schedules for their equipment.
  </p>
</div>
{/* STEP IMAGE */}
<div className="bg-white rounded-xl shadow-lg p-4 w-[80%] mx-auto">
  <img src={ownerLogoutImg } alt="Owner Logout" className="rounded-lg w-full" />
</div>

{/* STEP */}
<div className="relative pl-10">
  <div className="absolute -left-6 top-1 w-6 h-6 bg-green-600 rounded-full border-4 border-white"></div>

  <h2 className="text-2xl font-semibold mb-2">
    Logout
  </h2>

  <p className="text-gray-600">
    After managing equipment listings and booking requests,
    equipment owners can securely logout from their AgroRent account.
  </p>
</div>

      </div>

    </div>
  );
}

export default HowItWorks;