import { useEffect, useState, useContext } from 'react';
import { FaUsers, FaBox, FaDollarSign } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../axios';
import AuthContext from '../../context/AuthContext';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      fetchAnalytics();
    } else {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/analytics');
      setAnalytics(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard</h1>
      
      {loading ? (
        <h2>Loading...</h2>
      ) : error ? (
        <h2 className="text-red-500">{error}</h2>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
              <div className="p-4 bg-blue-100 text-blue-600 rounded-full mr-4">
                <FaDollarSign size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase">Total Sales</p>
                <h3 className="text-2xl font-bold text-gray-800">${analytics?.totalSales?.toFixed(2)}</h3>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
              <div className="p-4 bg-green-100 text-green-600 rounded-full mr-4">
                <FaBox size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase">Total Orders</p>
                <h3 className="text-2xl font-bold text-gray-800">{analytics?.totalOrders}</h3>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center">
              <div className="p-4 bg-purple-100 text-purple-600 rounded-full mr-4">
                <FaUsers size={24} />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-semibold uppercase">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-800">{analytics?.totalUsers}</h3>
              </div>
            </div>
          </div>

          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Daily Sales</h2>
            {analytics?.dailyOrders?.length === 0 ? (
              <p className="text-gray-500">No sales data available yet.</p>
            ) : (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.dailyOrders} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="_id" tick={{ fill: '#6b7280' }} />
                    <YAxis tick={{ fill: '#6b7280' }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
