import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
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
      await axios.post('https://velvora-living-backend.vercel.app/api/v1/users/register', {
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password
      })
      setTimeout(() => navigate('/login'), 4000)
    } catch (err) {
      console.error('Error during registration: ', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96
     m-auto mt-14 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>Sign Up</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      <input
        name='fullName'
        value={formData.fullName}
        onChange={handleChange}
        type='text'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Full Name'
        required
      />
      <input
        name='username'
        value={formData.username}
        onChange={handleChange}
        type='text'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Username'
        required
      />
      <input
        name='email'
        value={formData.email}
        onChange={handleChange}
        type='email'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Email'
        required
      />
      <input
        name='password'
        value={formData.password}
        onChange={handleChange}
        type='password'
        className='w-full px-3 py-2 border border-gray-800'
        placeholder='Password'
        required
      />
      <button type='submit' className='w-full bg-black text-white py-2 disabled:opacity-60'>SignUp</button>
    </form>
  )
}

export default SignUp
