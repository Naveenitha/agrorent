import { Link } from "react-router-dom";

function EquipmentCard({ equipment }) {

  return (

    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">

      <img
        src={`https://agrorent-3irp.onrender.com/uploads/${equipment.image}`}
        alt={equipment.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">

        <h2 className="text-lg font-semibold text-gray-800">
          {equipment.name}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Category: {equipment.category}
        </p>

        <p className="text-sm text-gray-500">
          Location: {equipment.location}
        </p>

        <p className="text-green-600 font-semibold mt-2">
          ₹{equipment.pricePerHour} / hour
        </p>

        <Link
          to={`/equipment/${equipment._id}`}
          className="inline-block mt-3 w-full text-center bg-[#78A91E] text-white py-2 rounded-lg hover:bg-[#6c9919] transition"
        >
          View Details
        </Link>

      </div>

    </div>

  );

}

export default EquipmentCard;
