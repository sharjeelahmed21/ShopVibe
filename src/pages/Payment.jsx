import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import CheckoutSteps from '../components/CheckoutSteps';

const Payment = () => {
  const { shippingAddress, savePaymentMethod } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const [paymentMethod, setPaymentMethod] = useState('EasyPaisa');

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate('/placeorder');
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-lg">
        <CheckoutSteps step1 step2 step3 />
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Payment Method</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-bold mb-4">Select Method</label>
              <div className="flex items-center mb-4">
                <input
                  id="easypaisa"
                  type="radio"
                  name="paymentMethod"
                  value="EasyPaisa"
                  checked={paymentMethod === 'EasyPaisa'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500"
                />
                <label htmlFor="easypaisa" className="ml-2 text-gray-700 font-semibold">
                  EasyPaisa
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="jazzcash"
                  type="radio"
                  name="paymentMethod"
                  value="JazzCash"
                  checked={paymentMethod === 'JazzCash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 focus:ring-red-500"
                />
                <label htmlFor="jazzcash" className="ml-2 text-gray-700 font-semibold">
                  JazzCash
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="banktransfer"
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={paymentMethod === 'Bank Transfer'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="banktransfer" className="ml-2 text-gray-700 font-semibold">
                  Bank Transfer
                </label>
              </div>
              <div className="flex items-center mb-4">
                <input
                  id="cod"
                  type="radio"
                  name="paymentMethod"
                  value="Cash On Delivery"
                  checked={paymentMethod === 'Cash On Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500"
                />
                <label htmlFor="cod" className="ml-2 text-gray-700 font-semibold">
                  Cash On Delivery
                </label>
              </div>
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

export default Payment;
