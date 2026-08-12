import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, keyword = '' }) => {
  if (pages <= 1) return null;

  return (
    <div className="flex justify-center space-x-2 mt-4">
      {[...Array(pages).keys()].map((x) => (
        <Link
          key={x + 1}
          to={keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`}
          className={`px-4 py-2 rounded-md transition ${
            x + 1 === page
              ? 'bg-blue-600 text-white font-bold'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {x + 1}
        </Link>
      ))}
    </div>
  );
};

export default Paginate;
