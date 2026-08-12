import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex items-center">
      <input
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search Products..."
        className="px-4 py-2 w-64 rounded-l-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border-none"
      />
      <button 
        type="submit" 
        className="px-4 py-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
      >
        <FaSearch />
      </button>
    </form>
  );
};

export default SearchBox;
