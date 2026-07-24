import React from "react";
import HomeCategoryCard from "./HomeCategoryCard";

interface HomeCategoryItem {
  image?: string;
  Image?: string;
  name: string;
  categoryId: string;
}

const defaultCategories: HomeCategoryItem[] = [
  {
    name: "Lamps & Lightings",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop",
    categoryId: "lamps-lighting",
  },
  {
    name: "Home Decor",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=600&auto=format&fit=crop",
    categoryId: "home-decor",
  },
  {
    name: "Kitchenware",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=600&auto=format&fit=crop",
    categoryId: "kitchenware",
  },
  {
    name: "Women Ethnic",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
    categoryId: "women-sarees",
  },
  {
    name: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    categoryId: "footwear",
  },
  {
    name: "Fashion Accessories",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=600&auto=format&fit=crop",
    categoryId: "accessories",
  },
];

interface HomeCategoryProps {
  items?: HomeCategoryItem[];
}

const HomeCategory: React.FC<HomeCategoryProps> = ({ items }) => {
  const displayItems = items && items.length > 0 ? items : defaultCategories;

  return (
    <div className="flex justify-center gap-7 flex-wrap px-4 lg:px-20">
      {displayItems.map((item, index) => (
        <HomeCategoryCard key={item.categoryId || index} item={item} />
      ))}
    </div>
  );
};

export default HomeCategory;