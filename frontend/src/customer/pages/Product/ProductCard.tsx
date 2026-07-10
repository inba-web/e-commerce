import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ProductItem {
  _id: string;
  title: string;
  description?: string;
  images: string[];
  mrpPrice: number;
  sellingPrice: number;
  discountPercent: number;
  brand?: string;
  color?: string;
}

const ProductCard = ({ item }: { item: ProductItem }) => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);

  if (!item) return null;

  const hasMultipleImages = item.images && item.images.length > 1;

  return (
    <div
      onClick={() => navigate(`/product/${item._id}`)}
      className="group w-full max-w-[320px] bg-white rounded-xl border border-gray-150 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition duration-300"
    >
      {/* Image Container */}
      <div
        onMouseEnter={() => {
          if (hasMultipleImages) setCurrentImage(1);
        }}
        onMouseLeave={() => {
          setCurrentImage(0);
        }}
        className="relative w-full aspect-[3/4] sm:h-80 overflow-hidden bg-gray-50 flex items-center justify-center"
      >
        <img
          src={item.images[currentImage] || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600"}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          alt={item.title}
        />
        {item.discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {item.discountPercent}% OFF
          </div>
        )}
      </div>

      {/* Info Content */}
      <div className="p-4 space-y-1">
        <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
          {item.color || "Inba Mart"}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          {item.title}
        </h3>

        {/* Pricing */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-base font-extrabold text-gray-900">
            ₹{item.sellingPrice}
          </span>
          {item.mrpPrice > item.sellingPrice && (
            <>
              <span className="text-xs text-gray-400 line-through">
                ₹{item.mrpPrice}
              </span>
              <span className="text-xs text-teal-600 font-bold">
                ({item.discountPercent}% Off)
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
