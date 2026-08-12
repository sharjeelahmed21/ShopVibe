import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../axios';
import AuthContext from '../context/AuthContext';
import { FaTrash } from 'react-icons/fa';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      const fetchWishlist = async () => {
        try {
          const { data } = await api.get('/users/wishlist');
          setWishlist(data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message);
          setLoading(false);
        }
      };
      fetchWishlist();
    }
  }, [userInfo, navigate]);

  const removeFromWishlistHandler = async (id) => {
    try {
      await api.post('/users/wishlist', { productId: id });
      setWishlist(wishlist.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>
      {loading ? (
        <h2 className="text-2xl mt-10">Loading...</h2>
      ) : error ? (
        <h2 className="text-2xl text-red-500 mt-10">{error}</h2>
      ) : wishlist.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg flex justify-between items-center">
          <p>Your wishlist is empty</p>
          <Link to="/" className="font-bold underline hover:text-blue-900">Go Back</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
              <button 
                onClick={() => removeFromWishlistHandler(product._id)}
                className="absolute top-2 right-2 bg-white text-red-500 hover:text-red-700 p-2 rounded-full shadow transition z-10"
                title="Remove from wishlist"
              >
                <FaTrash />
              </button>
              <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300" />
              </Link>
              <div className="p-4">
                <Link to={`/product/${product._id}`}>
                  <h2 className="text-lg font-semibold text-gray-800 hover:text-blue-600 truncate">{product.name}</h2>
                </Link>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-gray-900">${product.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
