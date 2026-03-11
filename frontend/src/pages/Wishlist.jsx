import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'

const Wishlist = () => {
  const { wishlistProducts, wishlistLoading, removeFromWishlist, addToCart, currency } = useContext(ShopContext)

  const getProductImage = (product) => {
    const first = product?.images?.[0]
    if (!first) return ''
    if (typeof first === 'string') {
      if (first.startsWith('http')) return first
      const match = first.match(/url:\s*'([^']+)'/);
      return match?.[1] || ''
    }
    if (typeof first === 'object' && first?.url) return first.url
    return ''
  }

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-6'>
        <Title text1={'MY'} text2={'WISHLIST'} />
      </div>

      {wishlistLoading && <p className='text-gray-600'>Loading wishlist...</p>}

      {!wishlistLoading && wishlistProducts.length === 0 && (
        <p className='text-gray-600'>Your wishlist is empty.</p>
      )}

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 gap-y-8'>
        {!wishlistLoading && wishlistProducts.map((product) => (
          <div key={product?._id} className='flex flex-col gap-2'>
            <Link to={`/product/${product?._id}`}>
              <img
                src={getProductImage(product)}
                alt={product?.name || 'product'}
                className='w-full object-cover'
              />
              <div className='mt-2'>
                <p className='text-sm font-medium truncate'>{product?.name}</p>
                <p className='text-sm text-gray-600'>{currency} {product?.price}</p>
                <p className='text-xs text-gray-400 mt-0.5'>
                  {product?.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              </div>
            </Link>

            <div className='flex gap-2 mt-auto'>
              <button
                onClick={() => addToCart(product?._id)}
                disabled={!product?.stock || product.stock <= 0}
                className={`flex-1 border text-xs py-1.5 transition-colors
                  ${!product?.stock || product.stock <= 0
                    ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                    : 'border-black hover:bg-black hover:text-white'
                  }`}
              >
                ADD TO CART
              </button>
              <button
                onClick={() => removeFromWishlist(product?._id)}
                className='border border-red-400 text-red-400 text-xs px-2 py-1.5 hover:bg-red-400 hover:text-white transition-colors'
                title='Remove from wishlist'
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
