import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { FaStar } from "react-icons/fa";
import { CiStar } from "react-icons/ci";
import { ShopContext } from '../context/ShopContext';

const Product = () => {
  const { currency, addToCart } = useContext(ShopContext)
  const { productId } = useParams()
  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [image, setImage] = useState(null)

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await axios.get(
          `https://velvora-living-backend.vercel.app/api/v1/products/get-products/${productId}`
        )
        const product = response?.data?.data ?? null
        setProductData(product)
        setImage(product?.images?.[0]?.url ?? null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [productId])

  const handleAddToCart = async () => {
    if (!productData?._id) return
    await addToCart(productData._id)
  }

  if (loading) return <div className='pt-10'>Loading product...</div>
  if (error) return <div className='pt-10 text-red-500'>Error: {error}</div>
  if (!productData) return <div className='pt-10'>Product not found.</div>

  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overscroll-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {(productData.images || []).map((item, index) => (
              <img
                onClick={() => setImage(item.url)}
                src={item.url}
                key={index}
                className='w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer'
                alt=''
              />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt='' />
          </div>
        </div>

        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-1 mt-2'>
            <FaStar className='w-3 h-5' />
            <FaStar className='w-3 h-5' />
            <FaStar className='w-3 h-5' />
            <FaStar className='w-3 h-5' />
            <CiStar className='w-3 h-5' />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency} {productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5 mb-8'>{productData.description}</p>

          <button
            onClick={handleAddToCart}
            className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'
          >
            ADD TO CART
          </button>

          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>100% Original product.</p>
            <p>Cash on delivery is available on this product.</p>
            <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product