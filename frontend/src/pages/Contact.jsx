import React from 'react'
import Title from '../components/Title'
import contactImg from '../assets/contact.jpg'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-20 mb-28'>
        <img className='w-full md:max-w-120' src={contactImg} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-500'>54706 Willims Station <br />Suite 350, Washington USA</p>
          <p className='text-gray-500'>Tel: (+91) 88xxxxxx98 <br /> Email: info@velvora.com</p>
          <p className='font-semibold text-xl text-gray-600'>Careers at Velvora</p>
          <p className='text-gray-500'>Learn more about our teams and jo openings.</p>
          <button className='border border-black px-8 py-4 hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
      </div>
        <NewsletterBox />
      
    </div>
  )
}

export default Contact
