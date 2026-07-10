import { useNavigate } from "react-router-dom";

interface HomeCategoryItem {
  image: string;
  name: string;
  categoryId: string;
}

const HomeCategoryCard = ({ item }: { item: HomeCategoryItem }) => {
  const navigate = useNavigate();
  if (!item) return null;

  return (
    <div
      onClick={() => navigate(`/search?category=${item.categoryId}`)}
      className="flex gap-3 flex-col justify-center items-center group cursor-pointer"
    >
      <div className="custom-border w-[120px] lg:w-[200px] h-[120px] lg:h-[200px] rounded-full overflow-hidden shadow-md bg-teal-50">
        <img
          className="group-hover:scale-110 transition-transform duration-500 object-cover w-full h-full"
          src={item.image}
          alt={item.name}
        />
      </div>

      <h1 className="font-semibold text-sm text-gray-800 text-center group-hover:text-teal-600">
        {item.name}
      </h1>
    </div>
  );
};

export default HomeCategoryCard;