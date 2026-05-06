
const HomeCategoryCard = ({}) => {
  return (
    <div className="flex gap-3 flex-col justify-center items-center group cursor-pointer">
      
      <div className="custom-border w-[150px] lg:w-[249px] h-[150px] lg:h-[249px] rounded-full overflow-hidden bg-teal-400">
        
        <img
          className="group-hover:scale-110 transition-transform duration-500 object-cover w-full h-full"
          src="https://images.unsplash.com/photo-1555488205-d5e67846cf40?q=80&w=1172&auto=format&fit=crop"
          alt=""
        />
      
      </div>

      <h1 className="font-medium text-center">
        Lamps & Lightings
      </h1>

    </div>
  )
}

export default HomeCategoryCard;