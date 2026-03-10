import React from 'react'
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useState } from 'react'
import { MdOutlineArrowDropDown } from "react-icons/md";
import Title from '../components/Title'
import { useEffect } from 'react';
import ProductItem from '../components/ProductItem'

const Collection = () => {

  const { products, loading, error } = useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  const [filterProducts, setFilterProducts] = useState([])
  const [category, setCategory] = useState([])
  const [sortType, setSortType] = useState('latest')

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  useEffect(() => {
    let updatedProducts = [...products];

    // 1) Category filter
    if (category.length > 0) {
      updatedProducts = updatedProducts.filter((item) =>
        category.includes(item.type)
      );
    }

    // 2) Sorting
    switch (sortType) {
      case 'price_asc':
        updatedProducts.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        break;
      case 'price_desc':
        updatedProducts.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        break;
      case 'oldest':
        updatedProducts.sort(
          (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
        break;
      case 'latest':
      default:
        updatedProducts.sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        break;
    }

    setFilterProducts(updatedProducts);
  }, [category, products, sortType])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      {/* filter option */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <MdOutlineArrowDropDown className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} />
        </p>
        {/* Category Filters */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Bed'} onChange={toggleCategory} /> Bed
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Sofa'} onChange={toggleCategory} /> Sofa
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Chair'} onChange={toggleCategory} /> Chair
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Table'} onChange={toggleCategory} /> Table
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Wardrobe'} onChange={toggleCategory} /> Wardrobe
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Cabinet'} onChange={toggleCategory} /> Cabinet
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Bookshelf'} onChange={toggleCategory} /> Bookshelf
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Desk'} onChange={toggleCategory} /> Desk
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Dresser'} onChange={toggleCategory} /> Dresser
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Tv Stand'} onChange={toggleCategory} /> Tv Stand
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Nightstand'} onChange={toggleCategory} /> Nightstand
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Outdoor Furniture'} onChange={toggleCategory} /> Outdoor Furniture
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type='checkbox' value={'Other'} onChange={toggleCategory} /> Other
            </p>

          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={'COLLECTIONS'} />

          {/* Product Sort */}
          <select className='border-2 border-gray-300 text-sm px-2' value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <option value="latest">Sort by: Latest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="price_desc">Sort by: High to Low</option>
            <option value="price_asc">Sort by: Low to High</option>
          </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {loading && <p>Loading products...</p>}
          {error && <p>Error: {error}</p>}
          {
            filterProducts.map((item, index) => (
              <ProductItem key={index} id={item._id} name={item.name} image={item.images} price={item.price} />
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default Collection
