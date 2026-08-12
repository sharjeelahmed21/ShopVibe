import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../axios';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';
import Rating from '../components/Rating';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import { mockProducts } from '../mockData';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const { addToCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.warn('API Failed, using mock data for demo purposes:', err.message);
        const product = mockProducts.find(p => p._id === id);
        if (product) {
          setProduct(product);
        } else {
          setError('Product not found');
        }
        setLoading(false);
      }
    };
    fetchProduct();
    if (userInfo) {
      api.get('/users/wishlist').then(res => {
        if (res.data.find(p => p._id === id || p === id)) {
          setInWishlist(true);
        }
      }).catch(err => console.error(err));
    }
  }, [id, userInfo]);

  const toggleWishlistHandler = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/users/wishlist', { productId: id });
      setInWishlist(!inWishlist);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      setReviewLoading(true);
      await api.post(`/products/${id}/reviews`, {
        rating,
        comment,
      });
      setReviewLoading(false);
      setRating(0);
      setComment('');
      alert('Review submitted successfully');
      // Fetch product again to update reviews
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setReviewLoading(false);
      setReviewError(err.response?.data?.message || err.message);
    }
  };

  const addToCartHandler = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  if (loading) return <h2 className="text-2xl mt-10">Loading product...</h2>;
  if (error) return <h2 className="text-2xl text-red-500 mt-10">{error}</h2>;

  return (
    <div className="animate-fade-in">
      <Link to="/" className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mb-6 transition">
        Go Back
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300" />
        </div>
        <div className="animate-fade-in relative" style={{ animationDelay: '0.2s' }}>
          {userInfo && (
            <button 
              onClick={toggleWishlistHandler}
              className="absolute top-0 right-0 text-3xl text-red-500 hover:scale-110 transition-transform"
              title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {inWishlist ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-4 pr-10">{product.name}</h1>
          <div className="mb-4">
            <Rating value={product.rating || 0} text={`${product.numReviews || 0} reviews`} />
          </div>
          <p className="text-2xl text-blue-600 font-semibold mb-4">${product.price}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-6">
            <div className="flex justify-between mb-4">
              <span className="font-semibold text-gray-700">Status:</span>
              <span className={product.countInStock > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                {product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-gray-700">Qty:</span>
                <select 
                  value={qty} 
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className={`w-full py-3 px-4 rounded font-bold text-white transition ${
                product.countInStock === 0 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-md'
              }`}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 bg-white p-8 rounded-xl shadow border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Reviews</h2>
        {(!product.reviews || product.reviews.length === 0) && (
          <div className="bg-blue-50 text-blue-600 p-4 rounded mb-6">No Reviews Yet. Be the first to review!</div>
        )}
        
        <div className="space-y-6 mb-10">
          {product.reviews && product.reviews.map((review) => (
            <div key={review._id} className="border-b pb-4">
              <strong className="block text-lg text-gray-800 mb-1">{review.name}</strong>
              <Rating value={review.rating} />
              <p className="text-gray-500 text-sm mt-1">{review.createdAt?.substring(0, 10)}</p>
              <p className="text-gray-700 mt-3 bg-gray-50 p-3 rounded">{review.comment}</p>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Write a Customer Review</h3>
          {reviewError && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{reviewError}</div>}
          
          {userInfo ? (
            <form onSubmit={submitReviewHandler}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={reviewLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition ${reviewLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="bg-yellow-50 text-yellow-700 p-4 rounded">
              Please <Link to="/login" className="font-bold underline hover:text-yellow-800">sign in</Link> to write a review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
