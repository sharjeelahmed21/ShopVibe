import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../axios';
import AuthContext from '../../context/AuthContext';

const UserEdit = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
    } else {
      const fetchUser = async () => {
        try {
          const { data } = await api.get(`/users/${userId}`);
          setName(data.name);
          setEmail(data.email);
          setIsAdmin(data.isAdmin);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || err.message);
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [userId, userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      await api.put(`/users/${userId}`, {
        name,
        email,
        isAdmin,
      });
      setUpdateLoading(false);
      alert('User updated successfully');
      navigate('/admin/userlist');
    } catch (err) {
      setUpdateLoading(false);
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <Link to="/admin/userlist" className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 mb-6 transition">
        Go Back
      </Link>
      
      <div className="bg-white p-8 rounded-xl shadow border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit User</h1>

        {loading ? (
          <h2>Loading...</h2>
        ) : error ? (
          <h2 className="text-red-500">{error}</h2>
        ) : (
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-gray-700 font-bold text-sm">Is Admin</span>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={updateLoading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded shadow transition duration-200 ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {updateLoading ? 'Updating...' : 'Update User'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEdit;
