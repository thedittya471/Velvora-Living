import React from 'react'
import Title from '../components/Title'
import aboutImg from '../assets/about.png'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-fit md:max-w-112.5' src={aboutImg} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Welcome to our story...</p>
          <p>We are a team of passionate individuals dedicated to creating beautiful and functional home goods. Forever was born out of passion for innovation and a desire to revolutionize the way people think about their living spaces.</p>
           <b className='text-gray-800'>Our Mission</b>
           <p>Our mission is to provide high-quality products that enhance the lives of our customers.</p>
        </div>
      </div>

      <div className='text-4xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Assurance:</b>
          <p className='text-gray-600'>We meticulously inspect every product to ensure it meets our high standards.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>With out user-friendly interface and hassel-free ordering process, shopping has never been easier.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction.</p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About
