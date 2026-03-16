import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEquipmentById, updateEquipment } from "../../services/equipmentService";

function EditEquipment() {

  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const data = await getEquipmentById(id);
        setFormData(data);
      } catch (error) {
        console.error("Failed to load equipment:", error);
      } finally {
        setLoading(false);
      }
    };
    loadEquipment();
  }, [id]);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSuccess("");
    await updateEquipment(id, formData);

    setSuccess("Equipment updated successfully!");
    setTimeout(() => {
      navigate("/my-equipments");
    }, 1500);

  };

  if (loading) {
    return <div className="pt-24 text-center">Loading...</div>;
  }

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-100 pt-20">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md"
      >

        <h1 className="text-xl font-bold text-green-600 mb-4">
          Edit Equipment
        </h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Equipment name"
          className="w-full border p-2 mb-3"
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border p-2 mb-3"
        />

        <input
          name="pricePerHour"
          value={formData.pricePerHour}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 mb-3"
        />

        <input
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 mb-3"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-2 mb-3"
        />

        {/* Availability Date and Time Section */}
        <div className="border-t pt-4 mt-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Availability Schedule</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Start Date */}
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate ? formData.startDate.split('T')[0] : ''}
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
                value={formData.endDate ? formData.endDate.split('T')[0] : ''}
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
                value={formData.startTime || ''}
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
                value={formData.endTime || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        <button className="bg-[#78A91E] text-white px-4 py-2 rounded">
          Update Equipment
        </button>

      </form>

    </div>

  );

}

export default EditEquipment;
