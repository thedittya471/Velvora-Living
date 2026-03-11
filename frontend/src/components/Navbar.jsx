import { useContext, useState } from 'react'
import Logo from '../assets/logo.png'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { GoSearch } from "react-icons/go";
import { IoPersonOutline } from "react-icons/io5";
import { BsBag } from "react-icons/bs";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { IoMdArrowBack } from "react-icons/io";
import axios from 'axios'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {

    const [visible, setVisible] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)
    const navigate = useNavigate()
    const { getCartCount, clearAuthState, refreshAccessToken, accessToken } = useContext(ShopContext)
    const cartTotal = getCartCount ? getCartCount() : 0

    const handleLogout = async () => {
    const logoutRequest = (token) => axios.post(
        'https://velvora-living-backend.vercel.app/api/v1/users/logout',
        {},
        {
            withCredentials: true,
            ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {})
        }
    )

    try {
        await logoutRequest(accessToken)
    } catch (err) {
        if (err?.response?.status === 401) {
            const newAccessToken = await refreshAccessToken()
            if (newAccessToken) {
                try {
                    await logoutRequest(newAccessToken)
                } catch (retryErr) {
                    if (retryErr?.response?.status !== 401) {
                        console.error('Logout retry error:', retryErr?.response?.data?.message || retryErr.message)
                    }
                }
            }
        } else {
            console.error('Logout error:', err?.response?.data?.message || err.message)
        }
    } finally {
        clearAuthState()
        navigate('/login')
    }
}

    return (
        <div className='flex items-center justify-between py-5 font-medium'>

            <Link to='/'>
                <img src={Logo} className='w-34' alt='Velvora Living Logo' />
            </Link>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>

                <NavLink to='/' className='flex flex-col items-center gap-1'>
                    <p>HOME</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/collection' className='flex flex-col items-center gap-1'>
                    <p>COLLECTION</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/wishlist' className='flex flex-col items-center gap-1'>
                    <p>WISHLIST</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/about' className='flex flex-col items-center gap-1'>
                    <p>ABOUT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>
                <NavLink to='/contact' className='flex flex-col items-center gap-1'>
                    <p>CONTACT</p>
                    <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
                </NavLink>

            </ul>

            <div className='flex items-center gap-6'>

                <GoSearch className='w-5 cursor-pointer' size={20} />

                <div className='relative'>
                    <IoPersonOutline
                        onClick={() => setProfileOpen((prev) => !prev)}
                        className='w-5 cursor-pointer'
                        size={20}
                    />
                    {profileOpen && (
                        <>
                            <div
                                className='fixed inset-0 z-10 cursor-pointer'
                                onClick={() => setProfileOpen(false)}
                            />
                            <div className='absolute right-0 pt-4 z-20'>
                                <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow-md'>
                                    <p className='cursor-pointer hover:text-black'>My Profile</p>
                                    <Link
                                        to='/orders'
                                        onClick={() => setProfileOpen(false)}
                                        className='cursor-pointer hover:text-black'
                                    >
                                        Orders
                                    </Link>
                                    <p
                                        onClick={handleLogout}
                                        className='cursor-pointer hover:text-black'
                                    >
                                        Logout
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <Link to='/cart' className='relative'>
                    <BsBag className='w-5 min-w-5' size={20} />
                    <p className='absolute -right-1.25 -bottom-1.25 w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px] '>{cartTotal}</p>
                </Link>

                <HiOutlineBars3BottomRight onClick={() => setVisible(true)} className='w-5 cursor-pointer sm:hidden' size={22} />
            </div>

            {/* SideBar Menu for Small Screens */}

            <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                        <IoMdArrowBack className='h-4' size={20} />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} to='/' className='py-2 pl-6 border-b border-t'>HOME</NavLink>
                    <NavLink onClick={() => setVisible(false)} to='/collection' className='py-2 pl-6 border-b'>COLLECTION</NavLink>
                    <NavLink onClick={() => setVisible(false)} to='/wishlist' className='py-2 pl-6 border-b'>WISHLIST</NavLink>
                    <NavLink onClick={() => setVisible(false)} to='/about' className='py-2 pl-6 border-b'>ABOUT</NavLink>
                    <NavLink onClick={() => setVisible(false)} to='/contact' className='py-2 pl-6 border-b'>CONTACT</NavLink>
                </div>
            </div>

        </div>
    )
}

export default Navbar
