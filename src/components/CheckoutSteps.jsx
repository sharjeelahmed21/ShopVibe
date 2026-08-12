import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="flex justify-center mb-8">
      <ul className="flex space-x-4 md:space-x-8">
        <li>
          {step1 ? (
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign In</Link>
          ) : (
            <span className="text-gray-400">Sign In</span>
          )}
        </li>
        <li>
          {step2 ? (
            <Link to="/shipping" className="text-blue-600 font-semibold hover:underline">Shipping</Link>
          ) : (
            <span className="text-gray-400">Shipping</span>
          )}
        </li>
        <li>
          {step3 ? (
            <Link to="/payment" className="text-blue-600 font-semibold hover:underline">Payment</Link>
          ) : (
            <span className="text-gray-400">Payment</span>
          )}
        </li>
        <li>
          {step4 ? (
            <Link to="/placeorder" className="text-blue-600 font-semibold hover:underline">Place Order</Link>
          ) : (
            <span className="text-gray-400">Place Order</span>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default CheckoutSteps;
