import React from 'react'
import ElectronicCategory from './ElectronicCategory/ElectronicCategory'
import Grid from './Grid/Grid'
import DealCard from '../Deal/DealCard'
import Deal from '../Deal/Deal'

const Home = () => {
  return (
    <div className='space-y-10'>
      <ElectronicCategory />

      <section>
        <Grid />
      </section>

      <section className='mt-10'>
        <h1 className='text-3xl font-black text-center pb-5'>Today's Deal</h1>
        <Deal />
      </section>

      {/* <section className='mt-10'>
        <h1 className='text-3xl font-black text-center pb-5'>Today's Deal</h1>
        <Deal />
      </section> */}
    </div>
  )
} 

export default Home