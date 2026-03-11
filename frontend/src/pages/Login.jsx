import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Login = () => {
  const navigate = useNavigate()
  const { refreshAuthState, setSessionTokens } = useContext(ShopContext)

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API = 'https://velvora-living-backend.vercel.app/api/v1'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)

      const payload = {
        email: formData.email.trim(),
        password: formData.password
      }

      const res = await axios.post(`${API}/users/login`, payload, { withCredentials: true })
      const accessToken = res?.data?.data?.accessToken || null
      const refreshToken = res?.data?.data?.refreshToken || null

      setSessionTokens(accessToken, refreshToken)
      await refreshAuthState(accessToken, refreshToken)
      navigate('/cart')
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'
    >
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Login</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>

      <input
        name='email'
        type='email'
        value={formData.email}
        onChange={handleChange}
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Email'
        required
      />

      <input
        name='password'
        type='password'
        value={formData.password}
        onChange={handleChange}
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Password'
        required
      />

      {error && <p className='w-full text-sm text-red-600'>{error}</p>}

      <button
        type='submit'
        disabled={loading}
        className='w-full bg-black text-white py-2 disabled:opacity-60'
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className='text-sm text-gray-600'>
        Don&apos;t have an account?{' '}
        <Link to='/signup' className='text-black underline'>
          Sign up
        </Link>
      </p>
    </form>
  )
}

export default Login