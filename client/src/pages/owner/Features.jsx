function Features() {
  return (
    <section className="bg-white py-20 mt-16">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-green-800">
          Why Choose AgroRent?
        </h2>

        <p className="text-gray-600 mb-16 max-w-2xl mx-auto">
          AgroRent connects farmers with equipment owners to make farming
          easier, faster, and more affordable.
        </p>

        <div className="grid md:grid-cols-4 gap-8 px-4">
          <div className="p-6 bg-green-50 rounded-xl shadow hover:shadow-lg transition border border-green-100">
            <div className="text-4xl mb-4">🚜</div>
            <h3 className="text-xl font-semibold mb-3 text-green-800">Wide Equipment Range</h3>
            <p className="text-gray-600">
              Rent tractors, harvesters, rotavators and other agricultural machines.
            </p>
          </div>

          <div className="p-6 bg-green-50 rounded-xl shadow hover:shadow-lg transition border border-green-100">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-3 text-green-800">Flexible Rentals</h3>
            <p className="text-gray-600">
              Choose rental duration based on your farming needs.
            </p>
          </div>

          <div className="p-6 bg-green-50 rounded-xl shadow hover:shadow-lg transition border border-green-100">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold mb-3 text-green-800">Nearby Equipment</h3>
            <p className="text-gray-600">
              Quickly find machines available near your location.
            </p>
          </div>

          <div className="p-6 bg-green-50 rounded-xl shadow hover:shadow-lg transition border border-green-100">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="text-xl font-semibold mb-3 text-green-800">Secure Payments</h3>
            <p className="text-gray-600">
              Safe and reliable payment options for equipment rental.
            </p>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-8 px-4">
          <div className="p-8 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4">For Farmers</h3>
            <ul className="text-left space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span> Access quality equipment without buying
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span> Save money on expensive machinery
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span> Find equipment near your farm
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-300">✓</span> Easy booking and payment process
              </li>
            </ul>
          </div>

          <div className="p-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl text-white">
            <h3 className="text-2xl font-bold mb-4">For Equipment Owners</h3>
            <ul className="text-left space-y-3">
              <li className="flex items-center gap-2">
                <span className="text-amber-200">✓</span> Earn passive income from your equipment
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-200">✓</span> Easy listing and management
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-200">✓</span> Connect with local farmers
              </li>
              <li className="flex items-center gap-2">
                <span className="text-amber-200">✓</span> Secure booking and payment system
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
