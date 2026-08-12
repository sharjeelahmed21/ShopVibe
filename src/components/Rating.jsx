import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = '#f8e825' }) => {
  return (
    <div className="flex items-center">
      <span className="flex text-yellow-400 mr-2">
        <span>
          {value >= 1 ? (
            <FaStar color={color} />
          ) : value >= 0.5 ? (
            <FaStarHalfAlt color={color} />
          ) : (
            <FaRegStar color={color} />
          )}
        </span>
        <span>
          {value >= 2 ? (
            <FaStar color={color} />
          ) : value >= 1.5 ? (
            <FaStarHalfAlt color={color} />
          ) : (
            <FaRegStar color={color} />
          )}
        </span>
        <span>
          {value >= 3 ? (
            <FaStar color={color} />
          ) : value >= 2.5 ? (
            <FaStarHalfAlt color={color} />
          ) : (
            <FaRegStar color={color} />
          )}
        </span>
        <span>
          {value >= 4 ? (
            <FaStar color={color} />
          ) : value >= 3.5 ? (
            <FaStarHalfAlt color={color} />
          ) : (
            <FaRegStar color={color} />
          )}
        </span>
        <span>
          {value >= 5 ? (
            <FaStar color={color} />
          ) : value >= 4.5 ? (
            <FaStarHalfAlt color={color} />
          ) : (
            <FaRegStar color={color} />
          )}
        </span>
      </span>
      {text && <span className="text-gray-600 font-medium text-sm ml-1">{text}</span>}
    </div>
  );
};

export default Rating;
