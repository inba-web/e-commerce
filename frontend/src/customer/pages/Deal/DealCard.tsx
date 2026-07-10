import { useNavigate } from "react-router-dom";

type DealItem = {
  _id?: string;
  image: string;
  discount: string;
  category?: string;
};

const DealCard = ({ deal }: { deal: DealItem }) => {
  const navigate = useNavigate();
  if (!deal) return null;

  return (
    <div
      onClick={() => navigate(`/search?category=${deal.category || ""}`)}
      className="w-full cursor-pointer group shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden border border-gray-100 bg-white"
    >
      {/* Image */}
      <div className="overflow-hidden bg-gray-50 h-56 flex items-center justify-center">
        <img
          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
          src={deal.image}
          alt="Deal Item"
        />
      </div>

      {/* Content */}
      <div className="bg-teal-600 text-white p-3 text-center">
        <p className="text-lg font-bold truncate">{deal.discount}</p>
        <p className="text-xs opacity-90 uppercase tracking-wider font-semibold mt-0.5">Shop Now</p>
      </div>
    </div>
  );
};

export default DealCard;