import React, { useState } from "react";

const ProductCard = ({ item }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="group px-4 relative">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="card"
      >
        
      </div>
    </div>
  );
};

export default ProductCard;
