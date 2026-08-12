import { useEffect, useState } from 'react';
import api from '../axios';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';

import { mockProducts } from '../mockData';

const Home = () => {
  const { keyword, pageNumber = 1 } = useParams();

  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products?keyword=${keyword || ''}&pageNumber=${pageNumber}`);
        // Now backend returns { products, page, pages }
        if (data.products) {
          setProducts(data.products);
          setPages(data.pages);
          setPage(data.page);
        } else {
          setProducts(data);
        }
        setLoading(false);
      } catch (err) {
        console.warn('API Failed, using mock data for demo purposes:', err.message);
        if (keyword) {
          const filtered = mockProducts.filter(p => 
            p.name.toLowerCase().includes(keyword.toLowerCase())
          );
          setProducts(filtered);
        } else {
          setProducts(mockProducts);
        }
        setPages(1);
        setPage(1);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, pageNumber]);

  if (loading) return <h2 className="text-2xl mt-10">Loading products...</h2>;
  if (error) return <h2 className="text-2xl text-red-500 mt-10">{error}</h2>;

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Latest Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div 
            key={product._id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
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
        {products.length === 0 && <p className="text-gray-500 col-span-full">No products found.</p>}
      </div>
      <div className="mt-10 flex justify-center">
        <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''} />
      </div>
    </div>
  );
};

export default Home;
