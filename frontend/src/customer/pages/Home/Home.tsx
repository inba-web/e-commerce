import ElectronicCategory from './ElectronicCategory/ElectronicCategory'
import Grid from './Grid/Grid'
import Deal from '../Deal/Deal'
import HomeCategory from './HomeCategory/HomeCategory'

const Home = () => {
  return (
    <div className='space-y-10'>
      <ElectronicCategory />

      <section>
        <Grid />
      </section>

      <section className='pt-10'>
        <h1 className='text-3xl font-black text-center pb-5'>Today's Deal</h1>
        <Deal />
      </section>

      <section className='pt-10'>
        <h1 className='text-3xl font-black text-center pb-5'>Shop By Category</h1>
        <HomeCategory />
      </section>

    </div>
  )
} 

export default Home