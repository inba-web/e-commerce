import React from 'react'
import ElectronicCategoryCard from './ElectronicCategoryCard'


const electronics = [
    {
        section: "ELECTRIC_CATEGORY",
        name: "Laptop",
        image: "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_UY218_.jpg",
        categoryId: "laptops"
    },
    {
        section: "ELECTRIC_CATEGORY",
        name: "Mobile",
        image: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/mobile/b/j/o/-original-imahft5nm9eewyzh.jpeg?q=90",
        categoryId: "mobiles"
    },
    {
        section: "ELECTRIC_CATEGORY",
        name: "SmartWatch",
        image: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/smartwatch/w/p/r/-original-imahjpzqhzavjfra.jpeg?q=90",
        categoryId: "smart-watches"
    },
    {
        section: "ELECTRIC_CATEGORY",
        name: "Headphones",
        image: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/headphone/r/q/l/foldable-over-ear-design-bluetooth-5-0-hi-fi-sound-for-music-original-imahdnsgyrhzhdpk.jpeg?q=90",
        categoryId: "headphones"
    },
    {
        section: "ELECTRIC_CATEGORY",
        name: "Speakers",
        image: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/speaker/mobile-tablet-speaker/y/n/7/m412sp-portable-dynamic-thunder-sound-with-high-bass-mz-original-imahmpczq7ngv9ep.jpeg?q=90",
        categoryId: "speakers"
    },
    {
        section: "ELECTRIC_CATEGORY",
        name: "Tv",
        image: "https://rukminim1.flixcart.com/image/1536/1536/xif0q/dslr-camera/j/u/p/-original-imahbymfhgutf4dn.jpeg?q=90",
        categoryId: "tv"
    },
    {
        section: "ELECTRIC_CATEGORY",
        name: "Cameras",
        image: "https://m.media-amazon.com/images/I/71jG+e7roXL._AC_UY218_.jpg",
        categoryId: "cameras"
    }
]

const ElectronicCategory = () => {
  return (
    <div className='flex flex-wrap justify-between py-5 lg:px-20 border-b'>
        {electronics.map((item) => <ElectronicCategoryCard key={item.categoryId} item={item} />)} 
    </div>
  )
}

export default ElectronicCategory