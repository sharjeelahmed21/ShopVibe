import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import CheckoutSteps from '../components/CheckoutSteps';
import api from '../axios';

const Shipping = () => {
  const { shippingAddress, saveShippingAddress } = useContext(CartContext);
  const { userInfo, updateProfile } = useContext(AuthContext);
  
  const [address, setAddress] = useState(shippingAddress.address || userInfo?.shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress.city || userInfo?.shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || userInfo?.shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || userInfo?.shippingAddress?.country || '');

  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=shipping');
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newAddress = { address, city, postalCode, country };
    saveShippingAddress(newAddress);
    
    try {
      // Auto-save delivery address to user's profile for next time!
      const { data } = await api.put('/users/profile', {
        shippingAddress: newAddress
      });
      updateProfile(data);
    } catch (err) {
      console.error('Failed to save address to profile', err);
    }

    navigate('/payment');
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-lg">
        <CheckoutSteps step1 step2 />
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Shipping</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Postal Code</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
