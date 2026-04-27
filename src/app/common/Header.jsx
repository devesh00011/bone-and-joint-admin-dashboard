'use client'
import React, { useEffect, useState } from 'react'
import { HeaderData } from '../api_data/Headermenu'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { usePathname, useRouter } from 'next/navigation'
import { adminLogout } from '../redux/slices/adminAuthSlice'
import Swal from 'sweetalert2'

export default function Header() {

    const token = useSelector((store) => store.adminAuth.token)

    const [menuOpen, setMenuOpen] = useState(false)

    const path = usePathname()

    const router = useRouter()

    useEffect(() => {
        if (!token && path !== '/verify-otp' && path !== '/forgot-password') {
            router.push('/')
        }
    }, [token, path])

    const menuData = [
        { name: 'doctors', link: 'doctors' },
        { name: 'services', link: 'services' },
        { name: 'appointments', link: 'appointments' },
        { name: 'enquiries', link: 'enquiries' },
        
    ]

    const dispatch = useDispatch()

    const logoutAdmin = () => {
        try {
            Swal.fire({
                title: "Are you sure?",
                text: "You will be logged out!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Logout",
                cancelButtonText: "Cancel"
            }).then((result) => {

                if (result.isConfirmed) {
                    dispatch(adminLogout())
                    localStorage.removeItem('admin_id')

                    Swal.fire({
                        title: "Logged Out!",
                        text: "You have been logged out successfully.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false
                    })
                }

            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <header className='sticky top-0 z-50 '>
            <div className='w-full bg-[#0D1D2D] relative'>
                <div className='max-w-[1320] mx-auto text-white py-5 px-6 flex items-center justify-between'>

                    {/* Logo */}
                    <h1 className='font-bold text-2xl text-[#00B0D3] tracking-wide cursor-pointer'>
                        <span className='text-white'>Admin</span>  Dashboard
                    </h1>

                    {/* Profile Section */}
                    <div className='flex items-center gap-6'>

                        {/* Profile Info */}
                        <div className='flex items-center gap-3 cursor-pointer group'>

                            {/* Avatar */}
                            <div className='w-10 h-10 rounded-full bg-[#00B0D3] text-white flex items-center justify-center font-semibold shadow-md group-hover:scale-105 transition duration-300'>
                                B
                            </div>

                            {/* Name & Role */}
                            <div className='hidden md:block text-right '>
                                <p onClick={() => setMenuOpen(!menuOpen)} className='font-medium text-white hover:text-[#00B0D3] duration-100 '>Bone & Joint </p>

                                <div
                                    className={`${menuOpen ? "scale-y-100" : "scale-y-0"
                                        } origin-top w-[200] transition-transform duration-100 shadow-2xl bg-white z-50 absolute top-full right-[100]`}
                                >
                                    <ul className='text-black flex items-start flex-col gap-2'>
                                        {menuData.map((item, index) => {
                                            return (
                                                <Link className='w-full' key={index} href={item.link}><li onClick={() => setMenuOpen(false)} className='py-2 px-5 capitalize w-full text-start hover:bg-[#004350] hover:text-white duration-300' >{item.name}</li></Link>
                                            )
                                        })}

                                        <li onClick={logoutAdmin} className='py-2 px-5 capitalize w-full text-start hover:bg-[#004350] hover:text-white duration-300' >Logout</li>

                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full bg-[#00B0D3]'>
                <ul className='flex items-center max-w-[1320] mx-auto text-white '>
                    {HeaderData.map((item, index) => <Link key={index} href={item.slug}><li key={index} className='hover:bg-[#0098b6] duration-300 border-x text-lg flex items-center gap-2 border-cyan-500 py-3 px-6 cursor-pointer capitalize'>{item.icon} {item.title}</li></Link>
                    )}
                </ul>
            </div>

        </header>
    )
}
