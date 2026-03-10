import React from 'react'
import Logo from '../assets/logo.png'

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={Logo} className='mb-5 w-32' alt="" />
                    <p className='w-full md:w-2/3 text-gray-600'>
                        Velvora Living is a premier online destination for exquisite home decor and furniture pieces. We curate a stunning collection of styles to elevate your living space with elevance and comfort. From timeless classics to modern designs, our products are crafted with quality and style in mind, ensuring that you find the perfect pieces to create a home that reflects your unique taste and personality.
                    </p>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Delivery</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>

                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+91 8825xxxxx6</li>
                        <li>contact@velvoraliving.com</li>
                    </ul>
                </div>

            </div>

            <div>
                    <hr />
                    <p className='py-5 text-sm text-center'>Copyright 2026@ velvora-living.com - All Right Reserved</p>
                </div>
        </div>
    )
}

export default Footer
