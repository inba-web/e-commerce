import React from "react";
import SliderImport from "react-slick";
import DealCard from "./DealCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = SliderImport.default || SliderImport;

interface DealItem {
  _id?: string;
  image: string;
  discount: string;
  category?: string; // category id to navigate to
}

const defaultDeals: DealItem[] = [
  {
    image: "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=600&auto=format&fit=crop&q=60",
    discount: "Flat 50% OFF",
    category: "women-sarees",
  },
  {
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60",
    discount: "Up to 30% OFF",
    category: "footwear",
  },
  {
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60",
    discount: "Minimum 40% OFF",
    category: "headphones",
  },
  {
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60",
    discount: "Flat 25% OFF",
    category: "smart-watches",
  },
  {
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=60",
    discount: "Up to 60% OFF",
    category: "kitchenware",
  },
  {
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=60",
    discount: "Flat 35% OFF",
    category: "footwear",
  },
];

interface DealProps {
  deals?: DealItem[];
}

const Deal: React.FC<DealProps> = ({ deals }) => {
  const displayDeals = deals && deals.length > 0 ? deals : defaultDeals;

  const settings = {
    dots: true,
    infinite: displayDeals.length > 4,
    speed: 1000,
    slidesToShow: Math.min(5, displayDeals.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, displayDeals.length),
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="py-5 px-4 lg:px-20">
      <div className="slide-container">
        <Slider {...settings}>
          {displayDeals.map((item, index) => (
            <div className="px-2" key={item._id || index}>
              <DealCard deal={item} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Deal;
