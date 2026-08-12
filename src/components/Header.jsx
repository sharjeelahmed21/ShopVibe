import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaChevronDown, FaHeart } from 'react-icons/fa';
import { useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import SearchBox from './SearchBox';
import api from '../axios';

const Header = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await api.post('/users/logout');
      logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <header className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          <span className="text-blue-500">Shop</span>Vibe
        </Link>
        <div className="w-full md:w-auto">
          <SearchBox />
        </div>
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/cart" className="flex items-center hover:text-blue-400 transition relative">
                <FaShoppingCart className="mr-2" /> Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full text-xs px-2 py-0.5">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </span>
                )}
              </Link>
            </li>
            {userInfo && (
              <li>
                <Link to="/wishlist" className="flex items-center hover:text-red-400 transition relative">
                  <FaHeart className="mr-2 text-red-500" /> Wishlist
                </Link>
              </li>
            )}
            {userInfo ? (
              <>
                <li className="relative">
                  <button 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center hover:text-blue-400 transition"
                  >
                    <FaUser className="mr-2" /> <span className="font-semibold">{userInfo.name}</span> <FaChevronDown className="ml-1 text-xs" />
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-xl py-2 z-50 animate-fade-in">
                      <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setProfileMenuOpen(false)}>Profile</Link>
                      <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">
                        Logout
                      </button>
                    </div>
                  )}
                </li>
                {userInfo.isAdmin && (
                  <li className="relative">
                    <button 
                      onClick={() => setAdminMenuOpen(!adminMenuOpen)}
                      className="flex items-center hover:text-blue-400 transition"
                    >
                      Admin <FaChevronDown className="ml-1 text-xs" />
                    </button>
                    {adminMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-xl py-2 z-50 animate-fade-in">
                        <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setAdminMenuOpen(false)}>Dashboard</Link>
                        <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setAdminMenuOpen(false)}>Products</Link>
                        <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setAdminMenuOpen(false)}>Orders</Link>
                        <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setAdminMenuOpen(false)}>Users</Link>
                      </div>
                    )}
                  </li>
                )}
              </>
            ) : (
              <li>
                <Link to="/login" className="flex items-center hover:text-blue-400 transition">
                  <FaUser className="mr-2" /> Sign In
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
