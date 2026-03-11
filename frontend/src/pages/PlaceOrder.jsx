import React, { useContext, useState } from 'react'
import axios from 'axios'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const { cartItems, currency, delivery_fee, getCartTotal, isAuthenticated, fetchCart, refreshAccessToken, accessToken } = useContext(ShopContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  })

  const subtotal = getCartTotal ? getCartTotal() : 0
  const total = subtotal + (cartItems?.length ? delivery_fee : 0)

  const [method, setMethod] = useState('cod')

  const onChangeHandler = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const paymentMethodMap = {
    cod: 'COD',
    card: 'Stripe',
    upi: 'Razorpay'
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (!cartItems?.length) {
      alert('Your cart is empty')
      return
    }

    try {
      const payload = {
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: paymentMethodMap[method] || 'COD'
      }

      const createOrderRequest = (token) => axios.post(
        'https://velvora-living-backend.vercel.app/api/v1/orders/create-order',
        payload,
        {
          withCredentials: true,
          ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {})
        }
      )

      try {
        await createOrderRequest(accessToken)
      } catch (error) {
        if (error?.response?.status === 401) {
          const newAccessToken = await refreshAccessToken()
          if (!newAccessToken) throw error

          await createOrderRequest(newAccessToken)
        } else {
          throw error
        }
      }

      await fetchCart()
      navigate('/orders')
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to place order')
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col lg:flex-row justify-between gap-10 lg:gap-20 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side */}
      <div className='flex flex-col gap-4 w-full lg:max-w-140'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input name='firstName' value={formData.firstName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' required />
          <input name='lastName' value={formData.lastName} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' required />
        </div>
        <input name='email' value={formData.email} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' required />
        <input name='address' value={formData.address} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' required />
        <div className='flex gap-3'>
          <input name='city' value={formData.city} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' required />
          <input name='state' value={formData.state} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' required />
        </div>
        <div className='flex gap-3'>
          <input name='postalCode' value={formData.postalCode} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Zipcode' required />
          <input name='country' value={formData.country} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' required />
        </div>
        <input name='phone' value={formData.phone} onChange={onChangeHandler} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="tel" placeholder='Phone' required />

      </div>

      {/* Right Side */}
      <div className='mt-8'>
        <div className='w-full lg:max-w-105 mt-8 lg:mt-16'>
        <div className='min-w-80'>
          <div className='text-xl sm:text-2xl my-3'>
            <Title text1={'CART'} text2={'TOTALS'} />
          </div>

          <div className='text-sm'>
            <div className='flex justify-between py-3 border-b'>
              <span>Subtotal</span>
              <span>{currency} {subtotal}</span>
            </div>

            <div className='flex justify-between py-3 border-b'>
              <span>Shipping Fee</span>
              <span>{currency} {cartItems?.length ? delivery_fee : 0}</span>
            </div>

            <div className='flex justify-between py-3 text-base font-semibold'>
              <span>Total</span>
              <span>{currency} {total}</span>
            </div>
          </div>
        </div>
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* Payment Method */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={()=>setMethod('card')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'card' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>Credit/Debit Card</p>
            </div>
            <div onClick={()=>setMethod('upi')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'upi' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>Upi</p>
            </div>
            <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>Cash On Delivery</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
