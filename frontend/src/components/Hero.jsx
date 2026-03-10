import React from 'react'
import HeroImg from '../assets/hero-img.jpg'

const Hero = () => {
  return (
    <div className='flex flex-col sm:flex-row border-gray-400 border'>
      {/* Left Side */}
      <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0'>
            <div className='text-[#414141] text-2xl font-bold'>
                <div className='flex items-center gap-2'>
                    <p className='w-8 md:w-11 h-0.5 bg-[#414141]'></p>
                    <p className='font-medium text-sm md:text-base'>OUR BESTSELLERS</p>
                </div>
                <h1 className='prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed'>Latest Arrivals</h1>
                <div className='flex items-center gap-2'>
                    <p className='font-semibold text-sm md:text-base'>SHOP NOW</p>
                    <p className='w-8 md:w-11 h-px bg-[#414141]'></p>
                </div>
            </div>
      </div>

      {/* Right Side */}
        <img className='w-full sm:w-1/2' src={HeroImg} alt="Hero Image" />
    </div>
  )
}

export default Hero
