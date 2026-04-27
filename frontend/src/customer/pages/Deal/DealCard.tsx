import React from 'react'

type dealCard = {
  image: string,
  discount: string
}

const DealCard = ({ deal }: {deal: dealCard}) => {

  if(!deal) return null;

  return (
    <div className='w-full cursor-pointer group'>

      {/* Image */}
      <div className='overflow-hidden rounded-t-lg'>
        <img 
          className='w-full h-64 object-cover object-top group-hover:scale-105 transition duration-300'
          src={deal.image} 
          alt=""
        />
      </div>

      {/* Content */}
      <div className='bg-black text-white p-3 text-center rounded-b-lg'>
        <p className='text-xl font-bold'>{deal.discount}</p>
        <p className='text-sm opacity-80'>Shop Now</p>
      </div>

    </div>
  )
}

export default DealCard