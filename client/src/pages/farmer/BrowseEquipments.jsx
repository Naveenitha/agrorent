import { useState, useEffect } from "react";
import { getAvailableEquipments } from "../../services/equipmentService";
import { createRazorpayOrder, verifyPayment, loadRazorpayScript } from "../../services/paymentService";

function BrowseEquipments() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: "",
    endDate: "",
    hours: ""
  });
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("location");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchEquipments();
    loadRazorpayScript().then((loaded) => {
      setRazorpayLoaded(loaded);
    });
  }, []);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const data = await getAvailableEquipments();
      setEquipments(data);
    } catch (error) {
      console.error("Failed to fetch equipments:", error);
    } finally {
      setLoading(false);
    }
  };

  // Show error message that auto-dismisses after 5 seconds
  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(""), 5000);
  };

  // Filter equipments based on search query
  const filteredEquipments = equipments.filter((equipment) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    if (searchType === "location") {
      return equipment.location?.toLowerCase().includes(query);
    } else if (searchType === "category") {
      return equipment.category?.toLowerCase().includes(query);
    }
    return true;
  });

  const handleBookNow = (equipment) => {
    setSelectedEquipment(equipment);
    setBookingData({
      startDate: "",
      endDate: "",
      hours: ""
    });
    setSuccessMessage("");
    setShowBookingModal(true);
  };

  const handleProceedToPay = async (e) => {
    e.preventDefault();
    
    if (!bookingData.startDate || !bookingData.endDate || !bookingData.hours) {
      showError("Please fill in all booking details");
      return;
    }

    // Check if equipment is available for the selected dates
    const equipmentStartDate = selectedEquipment.startDate ? new Date(selectedEquipment.startDate) : null;
    const equipmentEndDate = selectedEquipment.endDate ? new Date(selectedEquipment.endDate) : null;
    const equipmentStartTime = selectedEquipment.startTime;
    const equipmentEndTime = selectedEquipment.endTime;
    
    // Check if equipment has specific available dates set by owner
    if (equipmentStartDate && equipmentEndDate) {
      const selectedStart = new Date(bookingData.startDate);
      const selectedEnd = new Date(bookingData.endDate);
      
      // Check if selected dates are outside the equipment's available range
      // Equipment is only available between startDate and endDate
      if (selectedStart < equipmentStartDate || selectedEnd > equipmentEndDate) {
        const formattedAvailableStart = equipmentStartDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const formattedAvailableEnd = equipmentEndDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        
        let message = `Equipment is only available from ${formattedAvailableStart} to ${formattedAvailableEnd}.`;
        
        if (equipmentStartTime && equipmentEndTime) {
          message += ` Available time: ${equipmentStartTime} to ${equipmentEndTime}.`;
        }
        
        showError(message);
        return;
      }
    } else if (equipmentStartTime && equipmentEndTime) {
      // Equipment has time restrictions but no date restrictions
      showError(`This equipment is only available from ${equipmentStartTime} to ${equipmentEndTime}.`);
    }
    
    try {
      setPaymentLoading(true);
      
      const hours = Number(bookingData.hours);
      const totalPrice = hours * selectedEquipment.pricePerHour;

      // Create Razorpay order
      const order = await createRazorpayOrder({
        amount: totalPrice,
        equipmentId: selectedEquipment._id,
        startDate: bookingData.startDate,
        endDate: bookingData.endDate,
        hours: hours
      });

      setOrderData({
        orderId: order.orderId,
        amount: totalPrice,
        hours: hours,
        isMock: order.isMock || false
      });

      setShowBookingModal(false);
      setShowPaymentModal(true);
    } catch (error) {
      showError(error.response?.data?.message || "Failed to create payment order");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!orderData) {
      showError("Invalid order data");
      return;
    }

    // Handle mock payment (for testing without real Razorpay)
    if (orderData.isMock || orderData.orderId?.startsWith("mock_")) {
      try {
        setPaymentLoading(true);
        const result = await verifyPayment({
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: "mock_payment_" + Date.now(),
          razorpaySignature: "mock_signature",
          equipmentId: selectedEquipment._id,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          hours: orderData.hours,
          totalPrice: orderData.amount,
          isMock: true
        });

        setShowPaymentModal(false);
        setSuccessMessage("Payment successful! Your booking request has been sent to the owner. They will confirm your booking shortly.");
        setSelectedEquipment(null);
        fetchEquipments();
      } catch (error) {
        showError(error.response?.data?.message || "Failed to process payment");
      } finally {
        setPaymentLoading(false);
      }
      return;
    }

    // Real Razorpay payment
    if (!window.Razorpay) {
      showError("Payment system not loaded. Please refresh the page.");
      return;
    }

    try {
      setPaymentLoading(true);

      const options = {
        key: "rzpt_test_xxxxxxxxxxxxx", // Replace with actual key in production
        name: "AgroRent",
        description: `Payment for ${selectedEquipment.name}`,
        order_id: orderData.orderId,
        amount: orderData.amount * 100, // Convert to paise
        currency: "INR",
        handler: async (response) => {
          // Payment successful, verify and create booking
          try {
            const result = await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              equipmentId: selectedEquipment._id,
              startDate: bookingData.startDate,
              endDate: bookingData.endDate,
              hours: orderData.hours,
              totalPrice: orderData.amount
            });

            setShowPaymentModal(false);
            setSuccessMessage("Payment successful! Your booking request has been sent to the owner. They will confirm your booking shortly.");
            setSelectedEquipment(null);
            fetchEquipments();
          } catch (error) {
            showError(error.response?.data?.message || "Failed to verify payment");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#78A91E"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      showError("Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-24">
        <div className="text-xl text-green-600">Loading equipments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Browse Equipments
        </h1>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Type Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => setSearchType("location")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  searchType === "location"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Location
              </button>
              <button
                onClick={() => setSearchType("category")}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  searchType === "category"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <svg className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Type
              </button>
            </div>
            
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={searchType === "location" ? "Search by location..." : "Search by equipment type..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              />
              <svg
                className="h-5 w-5 text-gray-400 absolute left-3 top-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-500">
              Showing {filteredEquipments.length} result(s) for "{searchQuery}" in {searchType}
            </div>
          )}
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 animate-pulse">
            {errorMessage}
          </div>
        )}

        {equipments.length === 0 || filteredEquipments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? "No Matching Equipment Found" : "No Equipment Available"}
            </h2>
            <p className="text-gray-500">
              {searchQuery ? "Try adjusting your search criteria" : "Currently there are no equipments available for rent."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEquipments.map((equipment) => (
              <div
                key={equipment._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group"
              >
                {/* Image */}
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  {equipment.image ? (
                    <img
                      src={`http://localhost:5000/uploads/${equipment.image}`}
                      alt={equipment.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  {/* Availability Badge */}
                  <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-semibold shadow-md bg-green-500 text-white">
                    Available
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
                    {equipment.name}
                  </h3>

                  {/* Category */}
                  <div className="mb-4">
                    <span className="inline-block bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs px-4 py-1.5 rounded-full font-semibold">
                      {equipment.category}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {equipment.description || "No description available"}
                  </p>

                  {/* Location */}
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {equipment.location}
                  </div>

                  {/* Owner */}
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Owner: {equipment.owner?.name}
                  </div>

                  {/* Availability Date & Time */}
                  {(equipment.startDate || equipment.endDate) && (
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>
                        {equipment.startDate && new Date(equipment.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {equipment.startDate && equipment.endDate && ' - '}
                        {equipment.endDate && new Date(equipment.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {equipment.startTime && ` (${equipment.startTime}`}
                        {equipment.startTime && equipment.endTime && ' - '}
                        {equipment.endTime && `${equipment.endTime})`}
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center text-green-600 font-bold text-xl mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="text-2xl">₹{equipment.pricePerHour}</span>
                    <span className="text-sm text-gray-500 font-normal ml-1">/hour</span>
                  </div>

                  {/* Book Now Button */}
                  <button
                    onClick={() => handleBookNow(equipment)}
                    className="w-full bg-[#78A91E] text-white py-3 rounded-lg font-semibold hover:bg-[#6c9919] transition shadow-md hover:shadow-lg"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedEquipment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Book {selectedEquipment.name}
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleProceedToPay} className="space-y-4">
                {/* Availability Info */}
                {(selectedEquipment.startDate || selectedEquipment.endDate || selectedEquipment.startTime || selectedEquipment.endTime) && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-semibold text-blue-800 mb-1">📅 Equipment Availability:</p>
                    <p className="text-sm text-blue-700">
                      {selectedEquipment.startDate && selectedEquipment.endDate 
                        ? `${new Date(selectedEquipment.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} - ${new Date(selectedEquipment.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`
                        : 'Flexible dates'}
                      {selectedEquipment.startTime && selectedEquipment.endTime && 
                        ` | Time: ${selectedEquipment.startTime} - ${selectedEquipment.endTime}`}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.startDate}
                    onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.endDate}
                    onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bookingData.hours}
                    onChange={(e) => setBookingData({ ...bookingData, hours: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500"
                    placeholder="Enter number of hours"
                    required
                  />
                </div>

                {bookingData.hours && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">
                      Price per hour: <span className="font-semibold">₹{selectedEquipment.pricePerHour}</span>
                    </div>
                    <div className="text-lg font-bold text-green-600 mt-1">
                      Total: ₹{Number(bookingData.hours) * selectedEquipment.pricePerHour}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={paymentLoading || !razorpayLoaded}
                  className="w-full bg-[#78A91E] text-white py-3 rounded-lg font-semibold hover:bg-[#6c9919] transition disabled:opacity-50"
                >
                  {paymentLoading ? "Processing..." : "Proceed to Pay"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedEquipment && orderData && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Payment Details
                </h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Equipment Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800">{selectedEquipment.name}</h3>
                  <p className="text-sm text-gray-600">Duration: {orderData.hours} hours</p>
                </div>

                {/* Amount */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Amount</div>
                  <div className="text-2xl font-bold text-green-600">₹{orderData.amount}</div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("card")}
                      className={`p-3 border rounded-lg text-center transition ${
                        selectedPaymentMethod === "card"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <svg className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <span className="text-xs">Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("upi")}
                      className={`p-3 border rounded-lg text-center transition ${
                        selectedPaymentMethod === "upi"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <svg className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">UPI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod("netbanking")}
                      className={`p-3 border rounded-lg text-center transition ${
                        selectedPaymentMethod === "netbanking"
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <svg className="h-6 w-6 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-xs">Net Banking</span>
                    </button>
                  </div>
                </div>

                {/* Pay Now Button */}
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="w-full bg-[#78A91E] text-white py-3 rounded-lg font-semibold hover:bg-[#6c9919] transition disabled:opacity-50"
                >
                  {paymentLoading ? "Processing..." : "Pay Now ₹" + orderData.amount}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Secured by Razorpay
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default BrowseEquipments;
