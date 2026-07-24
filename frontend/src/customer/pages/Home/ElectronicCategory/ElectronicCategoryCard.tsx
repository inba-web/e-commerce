import { useNavigate } from "react-router-dom";

type categoryItem = {
  section: string;
  name: string;
  image?: string;
  Image?: string;
  categoryId: string;
};

const ElectronicCategoryCard = ({ item }: { item: categoryItem }) => {
  const navigate = useNavigate();
  if (!item) return null;

  return (
    <div
      onClick={() => navigate(`/search?category=${item.categoryId}`)}
      className="flex w-20 flex-col items-center gap-3 cursor-pointer group"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden bg-white shadow-sm flex items-center justify-center p-2 group-hover:shadow-md transition-shadow">
        <img className="object-contain h-12 w-12 group-hover:scale-110 transition-transform" src={item.Image || item.image} alt={item.name} />
      </div>
      <h2 className="font-semibold text-xs text-gray-700 text-center group-hover:text-teal-600">
        {item.name}
      </h2>
    </div>
  );
};

export default ElectronicCategoryCard;