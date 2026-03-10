import React from 'react'
import { RiExchangeFundsLine } from "react-icons/ri";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { BiSupport } from "react-icons/bi";

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>
      <div>
        <RiExchangeFundsLine className='w-12 m-auto mb-5' size={60} />
        <p className='font-semibold'>Easy Exchange Policy</p>
        <p className='text-gray-400'>we offer hassel free exchange policy</p>
      </div>
      <div>
        <VscWorkspaceTrusted className='w-12 m-auto mb-5' size={60} />
        <p className='font-semibold'>7 Days Return Policy</p>
        <p className='text-gray-400'>we provide 7 days free return policy</p>
      </div>
      <div>
        <BiSupport className='w-12 m-auto mb-5' size={60} />
        <p className='font-semibold'>Best customer support</p>
        <p className='text-gray-400'>we provide 24/7 customer support</p>
      </div>

    </div>
  )
}

export default OurPolicy
