import React, { useState } from "react";

const ProductCard = ({ item }: any) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="group px-4 relative overflow-hidden">
      <div
        onMouseEnter={() => {
          setIsHovered(true);
          setCurrentImage(1);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentImage(0);
        }}
        className="card relative w-full h-[350px] overflow-hidden"
      >
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentImage * 100}%)`,
          }}
        >
          {item.images.map((image: string, index: number) => (
            <img
              key={index}
              src={image}
              className="w-full h-[350px] object-cover flex-shrink-0"
              alt={`Product ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;