type categoryItem = {
  section: string,
  name: string,
  image: string,
  categoryId: string
} 

const ElectronicCategoryCard = ({item}:{item:categoryItem}) => {
  if(!item) return null;

  return (
    <div className='flex w-20 flex-col items-center gap-3 cursor-pointer'>
      <img className='object-contain h-10' src={item.image} alt={item.name} />
      <h2 className='font-semibold text-sm'>{item.name}</h2>
    </div>
  )
}

export default ElectronicCategoryCard