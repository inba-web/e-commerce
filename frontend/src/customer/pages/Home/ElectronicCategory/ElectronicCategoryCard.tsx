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
      className="flex w-24 flex-col items-center gap-3 cursor-pointer group relative"
    >
      {/* Outer circular wrapper with gradient background and smooth scale effect */}
      <div className="relative w-18 h-18 rounded-full p-[3px] bg-gradient-to-tr from-teal-500 to-emerald-400 shadow-md group-hover:shadow-teal-500/20 group-hover:shadow-lg transition-all duration-500 group-hover:scale-105">
        
        {/* Inner solid gap ring */}
        <div className="w-full h-full rounded-full bg-white p-[2px] overflow-hidden">
          
          {/* Image container */}
          <div className="w-full h-full rounded-full overflow-hidden relative bg-white flex items-center justify-center p-2">
            <img 
              className="object-contain h-10 w-10 group-hover:scale-110 transition-transform duration-500" 
              src={item.Image || item.image} 
              alt={item.name} 
            />
          </div>
        </div>

        {/* Decorative absolute element: rotating border pattern */}
        <div className="absolute inset-0 rounded-full border border-dashed border-teal-500/20 group-hover:border-teal-500/50 group-hover:rotate-45 transition-all duration-1000 pointer-events-none -m-1"></div>
      </div>

      {/* Title */}
      <h2 className="font-extrabold text-[11px] text-gray-700 text-center group-hover:text-teal-600 transition-colors duration-300">
        {item.name}
      </h2>
    </div>
  );
};

export default ElectronicCategoryCard;