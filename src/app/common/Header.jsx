'use client'
import React, { useState } from 'react'
import { HeaderData } from '../api_data/Headermenu'
import Link from 'next/link'

export default function Header() {

    return (
        <header className='sticky top-0 z-50'>
            <div className='w-full bg-[#0D1D2D]'>
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
                            <div className='hidden md:block text-right'>
                                <p className='font-medium text-white'>Bone & Joint</p>
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
