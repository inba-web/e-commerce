import React from "react";
import { useNavigate } from "react-router-dom";

interface GridProps {
  items?: any[];
}

const Grid: React.FC<GridProps> = () => {
  const navigate = useNavigate();
  const imgLeft = "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&auto=format&fit=crop&q=60";
  const imgRight = "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=60";

  return (
    <>
      {/* MOBILE & TABLET LAYOUT */}
      <div className="space-y-4 px-4 md:hidden">
        {/* Top Banner - Men's Apparel */}
        <div
          onClick={() => navigate("/search?category=men-jeans")}
          className="h-48 w-full rounded-lg overflow-hidden cursor-pointer relative shadow-md active:scale-[0.98] transition-transform duration-100"
        >
          <img className="w-full h-full object-cover" src={imgLeft} alt="Men's Fashion" />
          <div className="absolute inset-0 bg-black/30 flex items-end p-4">
            <span className="text-white font-bold text-xl drop-shadow-md">Men's Apparel</span>
          </div>
        </div>

        {/* Small Category Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div
            onClick={() => navigate("/search?category=footwear")}
            className="h-32 rounded-lg overflow-hidden cursor-pointer relative shadow-md active:scale-[0.98] transition-transform duration-100"
          >
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1664505504065-31f8937d2261?w=600&auto=format&fit=crop&q=60"
              alt="Shoes"
            />
            <div className="absolute inset-0 bg-black/25 flex items-end p-3">
              <span className="text-white font-bold text-sm">Premium Shoes</span>
            </div>
          </div>

          <div
            onClick={() => navigate("/search?category=mobiles")}
            className="h-32 rounded-lg overflow-hidden cursor-pointer relative shadow-md active:scale-[0.98] transition-transform duration-100"
          >
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60"
              alt="Mobiles"
            />
            <div className="absolute inset-0 bg-black/25 flex items-end p-3">
              <span className="text-white font-bold text-sm">Smartphones</span>
            </div>
          </div>

          <div
            onClick={() => navigate("/search?category=lamps-lighting")}
            className="h-32 rounded-lg overflow-hidden cursor-pointer relative shadow-md active:scale-[0.98] transition-transform duration-100"
          >
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=60"
              alt="Lamps"
            />
            <div className="absolute inset-0 bg-black/25 flex items-end p-3">
              <span className="text-white font-bold text-sm">Designer Lights</span>
            </div>
          </div>

          <div
            onClick={() => navigate("/search?category=smart-watches")}
            className="h-32 rounded-lg overflow-hidden cursor-pointer relative shadow-md active:scale-[0.98] transition-transform duration-100"
          >
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60"
              alt="Smartwatches"
            />
            <div className="absolute inset-0 bg-black/25 flex items-end p-3">
              <span className="text-white font-bold text-sm">Wearables</span>
            </div>
          </div>
        </div>

        {/* Bottom Banner - Women's Sarees */}
        <div
          onClick={() => navigate("/search?category=women-sarees")}
          className="h-48 w-full rounded-lg overflow-hidden cursor-pointer relative shadow-md active:scale-[0.98] transition-transform duration-100"
        >
          <img className="w-full h-full object-cover" src={imgRight} alt="Women's Fashion" />
          <div className="absolute inset-0 bg-black/30 flex items-end p-4">
            <span className="text-white font-bold text-xl drop-shadow-md">Women's Sarees</span>
          </div>
        </div>
      </div>

      {/* DESKTOP GALLERY LAYOUT */}
      <div className="hidden md:grid grid-cols-12 grid-rows-12 gap-4 h-[500px] lg:h-[650px] px-5 lg:px-20">
        {/* LEFT TALL - Men's Collection */}
        <div
          onClick={() => navigate("/search?category=men-jeans")}
          className="col-span-3 row-span-12 rounded-lg overflow-hidden cursor-pointer group relative shadow-md"
        >
          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={imgLeft} alt="Men's Fashion" />
          <div className="absolute inset-0 bg-black/30 flex items-end p-4">
            <span className="text-white font-bold text-lg lg:text-2xl drop-shadow-md">Men's Apparel</span>
          </div>
        </div>

        {/* CENTER GRID */}
        <div className="col-span-6 row-span-12 grid grid-cols-6 grid-rows-12 gap-4">
          {/* Top Left Small - Footwear */}
          <div
            onClick={() => navigate("/search?category=footwear")}
            className="col-span-2 row-span-5 rounded-lg overflow-hidden cursor-pointer group relative shadow-md"
          >
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1664505504065-31f8937d2261?w=600&auto=format&fit=crop&q=60"
              alt="Shoes"
            />
            <div className="absolute inset-0 bg-black/25 flex items-end p-2">
              <span className="text-white font-bold text-xs lg:text-sm">Premium Shoes</span>
            </div>
          </div>

          {/* Top Right Wide - Gadgets */}
          <div
            onClick={() => navigate("/search?category=mobiles")}
            className="col-span-4 row-span-5 rounded-lg overflow-hidden cursor-pointer group relative shadow-md"
          >
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60"
              alt="Mobiles"
            />
            <div className="absolute inset-0 bg-black/25 flex items-end p-3">
              <span className="text-white font-bold text-sm lg:text-lg">Smartphones & Tech</span>
            </div>
          </div>

          {/* Bottom Left Wide - Designer items */}
          <div
            onClick={() => navigate("/search?category=lamps-lighting")}
            className="col-span-4 row-span-7 rounded-lg overflow-hidden cursor-pointer group relative shadow-md"
          >
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&auto=format&fit=crop&q=60"
              alt="Lamps"
            />
            <div className="absolute inset-0 bg-black/25 flex items-end p-3">
              <span className="text-white font-bold text-sm lg:text-lg">Designer Lightings</span>
            </div>
          </div>

          {/* Bottom Right Small - Watches */}
          <div
            onClick={() => navigate("/search?category=smart-watches")}
            className="col-span-2 row-span-7 rounded-lg overflow-hidden cursor-pointer group relative shadow-md"
          >
            <img
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60"
              alt="Smartwatches"
            />
            <div className="absolute inset-0 bg-black/25 flex items-end p-2">
              <span className="text-white font-bold text-xs lg:text-sm">Smart Wearables</span>
            </div>
          </div>
        </div>

        {/* RIGHT TALL - Women's Collection */}
        <div
          onClick={() => navigate("/search?category=women-sarees")}
          className="col-span-3 row-span-12 rounded-lg overflow-hidden cursor-pointer group relative shadow-md"
        >
          <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={imgRight} alt="Women's Fashion" />
          <div className="absolute inset-0 bg-black/30 flex items-end p-4">
            <span className="text-white font-bold text-lg lg:text-2xl drop-shadow-md">Women's Sarees</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Grid;