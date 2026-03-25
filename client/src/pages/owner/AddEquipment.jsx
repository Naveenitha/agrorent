import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addEquipment } from "../../services/equipmentService";

function AddEquipment() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    pricePerHour: "",
    location: "",
    description: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: ""
  });

  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleImageChange = (e) => {

    setImage(e.target.files[0]);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const data = new FormData();

      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("pricePerHour", formData.pricePerHour);
      data.append("location", formData.location);
      data.append("description", formData.description);
      data.append("startDate", formData.startDate);
      data.append("endDate", formData.endDate);
      data.append("startTime", formData.startTime);
      data.append("endTime", formData.endTime);
      
      if (image) {
        data.append("image", image);
      }

      await addEquipment(data);

      setSuccess("Equipment added successfully!");
      setTimeout(() => {
        navigate("/my-equipments");
      }, 1500);

    } catch (err) {

      setError(
        err.response?.data?.message || "Failed to add equipment"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-24">

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

        <h1 className="text-2xl font-bold text-green-600 text-center mb-4">
          Add Equipment
        </h1>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-500 text-sm text-center mb-3">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium">Equipment Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter equipment name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Category</label>

            <input
              type="text"
              name="category"
              placeholder="Example: Tractor, Harvester"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Price Per Hour</label>

            <input
              type="number"
              name="pricePerHour"
              placeholder="Enter price"
              value={formData.pricePerHour}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>

            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>

            <textarea
              name="description"
              placeholder="Equipment description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500"
              rows="3"
            ></textarea>
          </div>

          {/* Availability Date and Time Section */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Availability Schedule</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="text-sm font-medium">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Start Time */}
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="text-sm font-medium">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Upload Image (Optional)</label>

            <input
              type="file"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#78A91E] text-white py-2 rounded-lg font-semibold hover:bg-[#6c9919] transition"
          >
            {loading ? "Adding Equipment..." : "Add Equipment"}
          </button>

        </form>

      </div>

    </div>

  );

}

export default AddEquipment;