import React, { useContext } from 'react'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'

const Cart = () => {
  const {
    cartItems,
    cartLoading,
    currency,
    delivery_fee,
    updateCartItem,
    clearCart,
    getCartTotal
  } = useContext(ShopContext)

  const subtotal = getCartTotal ? getCartTotal() : 0
  const total = subtotal + (cartItems?.length ? delivery_fee : 0)

  const extractUrlFromImageString = (imgStr) => {
    if (!imgStr || typeof imgStr !== 'string') return ''
    const match = imgStr.match(/url:\s*'([^']+)'/)
    return match?.[1] || ''
  }

  const getItemImage = (item) => {
    // 1) prefer cart snapshot images
    if (Array.isArray(item?.images) && item.images.length > 0) {
      const first = item.images[0]
      if (typeof first === 'string') {
        // if plain URL
        if (first.startsWith('http')) return first
        // if stringified object
        const parsed = extractUrlFromImageString(first)
        if (parsed) return parsed
      }
      if (typeof first === 'object' && first?.url) return first.url
    }

    // 2) fallback to populated product images
    const pFirst = item?.product?.images?.[0]
    if (typeof pFirst === 'string') {
      if (pFirst.startsWith('http')) return pFirst
      return extractUrlFromImageString(pFirst)
    }
    if (typeof pFirst === 'object' && pFirst?.url) return pFirst.url

    return ''
  }

  return (
    <div className='border-t pt-14'>
      <div className='text-2xl mb-3'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {cartLoading && <p className='text-gray-600'>Loading cart...</p>}
      {!cartLoading && (!cartItems || cartItems.length === 0) && (
        <p className='text-gray-600'>Your cart is empty.</p>
      )}

      <div>
        {(cartItems || []).map((item, index) => (
          <div
            key={index}
            className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_2fr_1fr] items-center gap-4'
          >
            <div className='flex items-start gap-6'>
              <img
                src={getItemImage(item)}
                className='w-16 sm:w-20'
                alt={item?.name || item?.product?.name || 'product'}
              />
              <div>
                <p className='text-xs sm:text-lg font-medium'>
                  {item?.name || item?.product?.name}
                </p>
                <div className='flex items-center gap-5 mt-2'>
                  <p>{currency} {item?.price}</p>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <button
                className='border px-2 py-1'
                onClick={() => updateCartItem(item?.product?._id || item?.product, -1)}
              >
                -
              </button>
              <input
                className='border max-w-12 sm:max-w-20 px-1 sm:px-2 py-1 text-center'
                type='number'
                min='1'
                value={item?.quantity || 1}
                readOnly
              />
              <button
                className='border px-2 py-1'
                onClick={() => updateCartItem(item?.product?._id || item?.product, 1)}
              >
                +
              </button>
            </div>

            <p className='text-right font-medium'>
              {currency} {(item?.price || 0) * (item?.quantity || 0)}
            </p>
          </div>
        ))}
      </div>

      {cartItems?.length > 0 && (
        <div className='mt-8 flex justify-end'>
          <div className='w-full sm:w-[420px] text-sm'>
            <div className='flex justify-between py-1'>
              <span>Subtotal</span>
              <span>{currency} {subtotal}</span>
            </div>
            <div className='flex justify-between py-1'>
              <span>Delivery Fee</span>
              <span>{currency} {delivery_fee}</span>
            </div>
            <div className='flex justify-between py-2 text-base font-semibold border-t mt-2'>
              <span>Total</span>
              <span>{currency} {total}</span>
            </div>

            <button
              onClick={clearCart}
              className='mt-4 border border-black px-5 py-2 text-sm'
            >
              CLEAR CART
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart