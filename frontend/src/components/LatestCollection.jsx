import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const LatestCollection = () => {

  const { products, loading, error } = useContext(ShopContext)
  const [latestProducts, setLatestProducts] = useState([])

  useEffect(() => {
    setLatestProducts(products.slice(0, 10))
  }, [products])

  console.log("Latest products:", latestProducts); // Check what's in latestProducts
  console.log("Loading:", loading, "Error:", error);

  if (loading) return <p className='text-center py-8 px-8 text-3xl'>Loading...</p>
  if (error) return <p className='text-center py-8 px-8 text-3xl'>Error...</p>

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTION'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
          Discover our latest collection of home decor and furniture, designed to elevate your living space with style and confort. From elegant sofas to chic coffee tables, our new arrivals offer blend of modern aesthetics and timeless charm.
        </p>
      </div>

      {/* Products List */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
          latestProducts.map((item, index) => (
            <ProductItem key={index} id={item._id} image={item.images} name={item.name} price={item.price} />
          ))
        }
      </div>
    </div>
  )
}

export default LatestCollection
