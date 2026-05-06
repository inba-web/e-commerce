import React from 'react'
import HomeCategoryCard from './HomeCategoryCard'

const HomeCategory = () => {
  return (
    <div className='flex justify-center gap-7 flex-wrap'>
      {[1,1,1,1,1,1,1,1,1,1].map((item) => <HomeCategoryCard />)}
    </div>
  )
}

export default HomeCategory