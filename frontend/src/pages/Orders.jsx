import React, { useCallback, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContext'

const Orders = () => {
  const { accessToken, refreshAccessToken, currency } = useContext(ShopContext)

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const API = 'https://velvora-living-backend.vercel.app/api/v1'

  const extractUrlFromImageString = (imgStr) => {
    if (!imgStr || typeof imgStr !== 'string') return ''
    if (imgStr.startsWith('http')) return imgStr

    const match = imgStr.match(/url:\s*'([^']+)'/)
    return match?.[1] || ''
  }

  const getProductImage = (product) => {
    const first = product?.images?.[0]

    if (!first) return ''
    if (typeof first === 'string') return extractUrlFromImageString(first)
    if (typeof first === 'object' && first?.url) return first.url

    return ''
  }

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A'

    return new Date(dateValue).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')

    const requestOrders = (token) => axios.get(
      `${API}/orders/get-user-orders`,
      {
        withCredentials: true,
        ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {})
      }
    )

    try {
      let res

      try {
        res = await requestOrders(accessToken)
      } catch (err) {
        if (err?.response?.status !== 401) throw err

        const newAccessToken = await refreshAccessToken()
        if (!newAccessToken) throw err

        res = await requestOrders(newAccessToken)
      }

      setOrders(res?.data?.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [API, accessToken, refreshAccessToken])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {loading && <p className='text-gray-600 mt-6'>Loading orders...</p>}
        {!loading && error && <p className='text-red-500 mt-6'>{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className='text-gray-600 mt-6'>You have no orders yet.</p>
        )}

        {!loading && !error && orders.map((order) => (
          <div
            key={order?._id}
            className='py-4 border-t border-b text-gray-700 flex flex-col gap-4 mt-4'
          >
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
              <p className='text-sm'>
                <span className='font-medium'>Order ID:</span> {order?._id}
              </p>
              <p className='text-sm'>
                <span className='font-medium'>Date:</span> {formatDate(order?.createdAt)}
              </p>
            </div>

            <div className='flex flex-col gap-3'>
              {(order?.orderItems || []).map((item, index) => (
                <div
                  key={`${order?._id}-${item?.product?._id || index}`}
                  className='grid grid-cols-[70px_1fr_auto] items-center gap-3'
                >
                  <img
                    src={getProductImage(item?.product)}
                    alt={item?.product?.name || 'product'}
                    className='w-16 h-16 object-cover border'
                  />

                  <div>
                    <p className='font-medium'>{item?.product?.name || 'Product'}</p>
                    <p className='text-sm text-gray-600'>Qty: {item?.quantity || 0}</p>
                  </div>

                  <p className='font-medium'>
                    {currency} {(item?.price || 0) * (item?.quantity || 0)}
                  </p>
                </div>
              ))}
            </div>

            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t pt-3'>
              <p className='text-sm'>
                <span className='font-medium'>Payment:</span> {order?.paymentMethod || 'COD'}
              </p>
              <p className='text-sm capitalize'>
                <span className='font-medium'>Status:</span> {order?.status || 'pending'}
              </p>
              <p className='font-semibold'>
                Total: {currency} {order?.totalPrice || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
