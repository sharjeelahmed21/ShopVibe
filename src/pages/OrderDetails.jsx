import { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../axios';
import AuthContext from '../context/AuthContext';

const OrderDetails = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deliverLoading, setDeliverLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      fetchOrder();
    }
  }, [orderId, userInfo, navigate]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      // Mocking order for demo if backend isn't ready or it fails
      console.warn(err);
      setError('Order not found or API unavailable.');
      setLoading(false);
    }
  };

  const deliverHandler = async () => {
    try {
      setDeliverLoading(true);
      await api.put(`/orders/${orderId}/deliver`, {});
      fetchOrder();
      setDeliverLoading(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
      setDeliverLoading(false);
    }
  };

  const payHandler = async () => {
    try {
      setPayLoading(true);
      await api.put(`/orders/${orderId}/pay`, {});
      fetchOrder();
      setPayLoading(false);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
      setPayLoading(false);
    }
  };

  return loading ? (
    <h2>Loading...</h2>
  ) : error ? (
    <h2 className="text-red-500">{error}</h2>
  ) : (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Order {order._id}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping</h2>
            <p className="text-gray-600 mb-2">
              <strong>Name: </strong> {order.user.name}
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Email: </strong> <a href={`mailto:${order.user.email}`} className="text-blue-500">{order.user.email}</a>
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Address: </strong>
              {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
              {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="bg-green-100 text-green-700 p-3 rounded">Delivered on {order.deliveredAt}</div>
            ) : (
              <div className="bg-red-100 text-red-700 p-3 rounded">Not Delivered</div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Method</h2>
            <p className="text-gray-600 mb-4">
              <strong>Method: </strong>
              {order.paymentMethod}
            </p>
            {!order.isPaid && (
              <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded">
                <h3 className="font-bold text-gray-700 mb-2">Payment Instructions:</h3>
                {order.paymentMethod === 'JazzCash' && (
                  <p className="text-sm text-gray-600">Please send your total amount to JazzCash Mobile Account: <strong>0300-1234567</strong> (Title: E-Commerce Store). After sending, please wait for admin verification.</p>
                )}
                {order.paymentMethod === 'EasyPaisa' && (
                  <p className="text-sm text-gray-600">Please send your total amount to EasyPaisa Mobile Account: <strong>0345-1234567</strong> (Title: E-Commerce Store). After sending, please wait for admin verification.</p>
                )}
                {order.paymentMethod === 'Bank Transfer' && (
                  <p className="text-sm text-gray-600">Please deposit your total amount to Meezan Bank, Account #: <strong>0123456789</strong>, Title: <strong>E-Commerce Store</strong>. Please use Order ID as reference.</p>
                )}
                {order.paymentMethod === 'Cash On Delivery' && (
                  <p className="text-sm text-gray-600">Please pay the rider in exact cash when your order arrives.</p>
                )}
              </div>
            )}
            {order.isPaid ? (
              <div className="bg-green-100 text-green-700 p-3 rounded">Paid on {order.paidAt}</div>
            ) : (
              <div className="bg-red-100 text-red-700 p-3 rounded">Not Paid</div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Items</h2>
            {order.orderItems.length === 0 ? (
              <p className="text-gray-600">Order is empty</p>
            ) : (
              <div className="divide-y">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center py-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="ml-4 flex-1">
                      <Link to={`/product/${item.product}`} className="font-semibold text-gray-800 hover:text-blue-600">
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-gray-600 font-medium">
                      {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100 sticky top-24">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-lg">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {userInfo && userInfo.isAdmin && !order.isPaid && order.paymentMethod !== 'Cash On Delivery' && (
              <button
                type="button"
                className={`w-full py-3 px-4 rounded font-bold text-white transition shadow-md mb-3 ${payLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                disabled={payLoading}
                onClick={payHandler}
              >
                {payLoading ? 'Loading...' : 'Mark As Paid'}
              </button>
            )}

            {userInfo && userInfo.isAdmin && !order.isDelivered && (
              <button
                type="button"
                className={`w-full py-3 px-4 rounded font-bold text-white transition shadow-md ${deliverLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={deliverLoading}
                onClick={deliverHandler}
              >
                {deliverLoading ? 'Loading...' : 'Mark As Delivered'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
