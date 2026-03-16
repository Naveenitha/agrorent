import { useEffect, useState } from "react";
import { getOwnerBookings, updateBookingStatus } from "../../services/bookingService";

function OwnerBookings() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getOwnerBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleConfirmBooking = async (bookingId) => {
    try {
      setUpdating(bookingId);
      await updateBookingStatus(bookingId, "confirmed");
      // Update local state to reflect the change
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: "confirmed" } : booking
      ));
      setMessage({ type: 'success', text: "Booking confirmed successfully!" });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || "Failed to confirm booking" });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setUpdating(null);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }
    try {
      setUpdating(bookingId);
      await updateBookingStatus(bookingId, "cancelled");
      // Update local state to reflect the change
      setBookings(bookings.map(booking => 
        booking._id === bookingId ? { ...booking, status: "cancelled" } : booking
      ));
      setMessage({ type: 'success', text: "Booking cancelled successfully!" });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || "Failed to cancel booking" });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-green-100 text-green-800 border-green-300",
      completed: "bg-blue-100 text-blue-800 border-blue-300",
      cancelled: "bg-red-100 text-red-800 border-red-300"
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusStyles[status] || statusStyles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-24">
        <div className="text-xl text-green-600">Loading...</div>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Booking Requests
        </h1>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Notification Banner for Pending Bookings */}
        {bookings.some(b => b.status === "pending") && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <svg className="h-6 w-6 text-yellow-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-yellow-700 font-medium">
                You have {bookings.filter(b => b.status === "pending").length} pending booking request(s) awaiting confirmation
              </span>
            </div>
          </div>
        )}

        {bookings.length === 0 ? (
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Booking Requests Yet
            </h2>
            <p className="text-gray-500">
              When farmers request to book your equipment, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl hover:border-green-400 hover:scale-[1.01] transition-all duration-300 border-2 border-gray-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Booking Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="text-xl font-bold text-gray-800">
                        {booking.equipment?.name}
                      </h2>
                      {getStatusBadge(booking.status)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">Farmer:</span>
                        <span className="ml-1">{booking.user?.name}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Email:</span>
                        <span className="ml-1">{booking.user?.email}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">From:</span>
                        <span className="ml-1">
                          {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">To:</span>
                        <span className="ml-1">
                          {booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Hours:</span>
                        <span className="ml-1">{booking.hours || 'N/A'}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Total Price:</span>
                        <span className="ml-1 font-bold text-green-600">₹{booking.totalPrice}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2">
                    {booking.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleConfirmBooking(booking._id)}
                          disabled={updating === booking._id}
                          className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {updating === booking._id ? "Confirming..." : "Confirm"}
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          disabled={updating === booking._id}
                          className="bg-red-500 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === "confirmed" && (
                      <div className="bg-green-100 text-green-700 px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 border border-green-300">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Confirmed
                      </div>
                    )}
                    {booking.status === "completed" && (
                      <div className="bg-blue-100 text-blue-700 px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 border border-blue-300">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </div>
                    )}
                    {booking.status === "cancelled" && (
                      <div className="bg-red-100 text-red-700 px-6 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 border border-red-300">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancelled
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default OwnerBookings;
