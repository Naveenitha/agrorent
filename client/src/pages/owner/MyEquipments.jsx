import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyEquipments, deleteEquipment } from "../../services/equipmentService";

function MyEquipments() {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

  useEffect(() => {
    fetchEquipments();
  }, []);

  const fetchEquipments = async () => {
    try {
      setLoading(true);
      const data = await getMyEquipments();
      console.log("Equipment data:", data);
      setEquipments(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch equipment");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleteLoading(id);
      await deleteEquipment(id);
      // Remove the deleted equipment from the state
      setEquipments(equipments.filter((eq) => eq._id !== id));
      setMessage({ type: 'success', text: 'Equipment deleted successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to delete equipment' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setDeleteLoading(null);
      setShowDeleteModal(false);
      setEquipmentToDelete(null);
    }
  };

  const confirmDelete = (equipment) => {
    setEquipmentToDelete(equipment);
    setShowDeleteModal(true);
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Equipments</h1>
          <Link
            to="/add-equipment"
            className="bg-[#78A91E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6c9919] transition shadow-md flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Equipment
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {message.text && (
          <div className={`mb-4 px-4 py-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {equipments.length === 0 ? (
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
              No Equipment Added Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start adding your agricultural equipment to rent them out to
              farmers.
            </p>
            <Link
              to="/add-equipment"
              className="inline-block bg-[#78A91E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#6c9919] transition"
            >
              Add Your First Equipment
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipments.map((equipment) => (
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
                  <div
                    className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-semibold shadow-md ${
                      equipment.available
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {equipment.available ? "Available" : "Rented"}
                  </div>
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

                  {/* Availability Schedule - Always visible */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center text-green-700 text-sm font-bold mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1.5"
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
                      Available Schedule
                    </div>
                    <div className="text-xs text-gray-600 space-y-1.5">
                      {/* Debug: Show raw data */}
                      {console.log("Debug - Equipment:", equipment.startDate, equipment.endDate, equipment.startTime, equipment.endTime) || null}
                      
                      {/* Dates */}
                      {equipment.startDate || equipment.endDate ? (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Dates:</span>
                          <span className="ml-1">
                            {equipment.startDate ? new Date(equipment.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'} - 
                            {equipment.endDate ? new Date(equipment.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>No dates set</span>
                        </div>
                      )}
                      
                      {/* Time */}
                      {equipment.startTime || equipment.endTime ? (
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-medium">Time:</span>
                          <span className="ml-1">
                            {equipment.startTime || 'Not set'} - {equipment.endTime || 'Not set'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>No time set</span>
                        </div>
                      )}
                    </div>
                  </div>

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

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      to={`/edit-equipment/${equipment._id}`}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </Link>
                    <button
                      onClick={() => confirmDelete(equipment)}
                      disabled={deleteLoading === equipment._id}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      {deleteLoading === equipment._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && equipmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Equipment</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{equipmentToDelete.name}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setEquipmentToDelete(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(equipmentToDelete._id)}
                  disabled={deleteLoading === equipmentToDelete._id}
                  className="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleteLoading === equipmentToDelete._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyEquipments;
