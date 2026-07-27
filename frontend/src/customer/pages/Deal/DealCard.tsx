import { useNavigate } from "react-router-dom";

type DealItem = {
  _id?: string;
  image?: string;
  discount?: string;
  discout?: number;
  category?: string | {
    _id: string;
    name: string;
    categoryId: string;
    Image?: string;
    image?: string;
    section?: string;
  };
};

const DealCard = ({ deal }: { deal: DealItem }) => {
  const navigate = useNavigate();
  if (!deal) return null;

  const catObj = (deal.category && typeof deal.category === "object") ? deal.category : null;
  const imageUrl = catObj ? (catObj.Image || catObj.image) : deal.image;
  const discountText = catObj ? `Flat ${deal.discout}% OFF` : deal.discount;
  const categoryId = catObj ? catObj.categoryId : deal.category;

  return (
    <div
      onClick={() => navigate(`/search?category=${categoryId || ""}`)}
      className="w-full cursor-pointer group shadow-sm hover:shadow-md transition-shadow rounded-lg overflow-hidden border border-gray-100 bg-white"
    >
      {/* Image */}
      <div className="overflow-hidden bg-gray-50 h-56 flex items-center justify-center">
        <img
          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
          src={imageUrl}
          alt="Deal Item"
        />
      </div>

      {/* Content */}
      <div className="bg-teal-600 text-white p-3 text-center">
        <p className="text-lg font-bold truncate">{discountText}</p>
        <p className="text-xs opacity-90 uppercase tracking-wider font-semibold mt-0.5">Shop Now</p>
      </div>
    </div>
  );
};

export default DealCard;