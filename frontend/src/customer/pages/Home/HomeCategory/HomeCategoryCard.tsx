import { useNavigate } from "react-router-dom";

interface HomeCategoryItem {
  image?: string;
  Image?: string;
  name: string;
  categoryId: string;
}

const HomeCategoryCard = ({ item }: { item: HomeCategoryItem }) => {
  const navigate = useNavigate();
  if (!item) return null;

  return (
    <div
      onClick={() => navigate(`/search?category=${item.categoryId}`)}
      className="flex flex-col justify-center items-center group cursor-pointer relative"
    >
      {/* Outer circular wrapper with gradient background and smooth scale effect */}
      <div className="relative w-[130px] lg:w-[210px] h-[130px] lg:h-[210px] rounded-full p-[4px] bg-gradient-to-tr from-teal-500 via-emerald-400 to-yellow-400 shadow-lg group-hover:shadow-teal-500/30 group-hover:shadow-xl transition-all duration-500 group-hover:scale-105">
        
        {/* Inner solid gap ring */}
        <div className="w-full h-full rounded-full bg-white p-[3px] overflow-hidden">
          
          {/* Image container */}
          <div className="w-full h-full rounded-full overflow-hidden relative bg-teal-50/50">
            <img
              className="group-hover:scale-115 transition-transform duration-700 object-cover w-full h-full"
              src={item.Image || item.image}
              alt={item.name}
            />
            {/* Subtle inner shadow overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4 lg:pb-6 pointer-events-none">
              <span className="text-white text-[9px] lg:text-[11px] font-black uppercase tracking-widest px-2.5 py-1 bg-teal-600/90 rounded-full shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                Shop Now
              </span>
            </div>
          </div>
        </div>

        {/* Decorative absolute element: rotating border pattern */}
        <div className="absolute inset-0 rounded-full border-2 border-dashed border-teal-500/20 group-hover:border-teal-500/50 group-hover:rotate-45 transition-all duration-1000 pointer-events-none -m-1.5"></div>
      </div>

      {/* Title */}
      <h3 className="font-extrabold text-xs lg:text-sm text-gray-800 text-center mt-3.5 group-hover:text-teal-700 transition-colors duration-300">
        {item.name}
      </h3>
    </div>
  );
};

export default HomeCategoryCard;