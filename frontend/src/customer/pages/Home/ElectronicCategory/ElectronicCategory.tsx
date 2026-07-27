import React from "react";
import ElectronicCategoryCard from "./ElectronicCategoryCard";

interface CategoryItem {
  section: string;
  name: string;
  image?: string;
  Image?: string;
  categoryId: string;
}

const defaultElectronics: CategoryItem[] = [
  {
    section: "ELECTRIC_CATEGORY",
    name: "Laptops",
    image: "https://images.unsplash.com/photo-1496181130204-755241544e35?q=80&w=600&auto=format&fit=crop",
    categoryId: "laptops",
  },
  {
    section: "ELECTRIC_CATEGORY",
    name: "Mobiles",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop",
    categoryId: "mobiles",
  },
  {
    section: "ELECTRIC_CATEGORY",
    name: "Smart Watches",
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=600&auto=format&fit=crop",
    categoryId: "smart-watches",
  },
  {
    section: "ELECTRIC_CATEGORY",
    name: "Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    categoryId: "headphones",
  },
  {
    section: "ELECTRIC_CATEGORY",
    name: "Speakers",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop",
    categoryId: "speakers",
  },
  {
    section: "ELECTRIC_CATEGORY",
    name: "Television",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=600&auto=format&fit=crop",
    categoryId: "tv",
  },
  {
    section: "ELECTRIC_CATEGORY",
    name: "Cameras",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
    categoryId: "cameras",
  },
];

interface ElectronicCategoryProps {
  items?: CategoryItem[];
}

const ElectronicCategory: React.FC<ElectronicCategoryProps> = ({ items }) => {
  const displayItems = items && items.length > 0 ? items : defaultElectronics;

  return (
    <div className="flex flex-wrap justify-center gap-8 md:gap-12 py-6 px-4 lg:px-20 border-b bg-gray-50">
      {displayItems.map((item) => (
        <ElectronicCategoryCard key={item.categoryId} item={item} />
      ))}
    </div>
  );
};

export default ElectronicCategory;