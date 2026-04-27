import React from 'react'

const Grid = () => {
  const img = "https://kisah.in/cdn/shop/files/KA-0161-7169-C102-01.jpg";

  return (
    <div className='grid grid-cols-12 grid-rows-12 gap-4 h-[600px] px-5 lg:px-20'>

      {/* LEFT TALL */}
      <div className='col-span-3 row-span-12 rounded-md overflow-hidden'>
        <img className='w-full h-full object-cover' src={img} />
      </div>

      {/* CENTER SECTION (THIS IS THE TRICK) */}
      <div className='col-span-6 row-span-12 grid grid-cols-6 grid-rows-12 gap-4'>

        {/* Top Left Small */}
        <div className='col-span-2 row-span-5 rounded-md overflow-hidden'>
          <img className='w-full h-full object-cover' src={"https://images.unsplash.com/photo-1664505504065-31f8937d2261?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1lbiUyMGZhc2hpb24lMjBzaG9lfGVufDB8fDB8fHww"} />
        </div>

        {/* Top Right Wide */}
        <div className='col-span-4 row-span-5 rounded-md overflow-hidden'>
          <img className='w-full h-full object-cover' src={"https://plus.unsplash.com/premium_photo-1708274926468-f3ef322edffc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODF8fGZhc2hpb25zfGVufDB8MHwwfHx8MA%3D%3D"} />
        </div>

        {/* Bottom Left Wide */}
        <div className='col-span-4 row-span-7 rounded-md overflow-hidden'>
          <img className='w-full h-full object-cover' src={"https://images.unsplash.com/photo-1485125639709-a60c3a500bf1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTM4fHxmYXNoaW9uc3xlbnwwfHwwfHx8MA%3D%3D"} />
        </div>

        {/* Bottom Right Small */}
        <div className='col-span-2 row-span-7 rounded-md overflow-hidden'>
          <img className='w-full h-full object-cover' src={"https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVuJTIwZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D"} />
        </div>

      </div>

      {/* RIGHT TALL */}
      <div className='col-span-3 row-span-12 rounded-md overflow-hidden'>
        <img className='w-full h-full object-cover' src={"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D"} />
      </div>

    </div>
  )
}

export default Grid