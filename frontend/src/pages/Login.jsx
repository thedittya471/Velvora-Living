import React, { useContext, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Login = () => {

  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password.trim()
      }

      const res = await axios.post('https://velvora-living-backend.vercel.app/api/v1/users/login', payload)
      const accessToken = res?.data?.data.accessToken
      const refreshToken = res?.data?.data?.data.refreshToken
      if (!accessToken) throw new Error('No access token returned')

      localStorage.setItem('token', accessToken)
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
      navigate('/')
    } catch (err) {
      console.error(err?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96
     m-auto mt-14 gap-4 text-gray-800'>
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

      <button
        type='submit'
        className='w-full bg-black text-white py-2 disabled:opacity-60'
      >Login</button>
    </form>
  )
}

export default Login
