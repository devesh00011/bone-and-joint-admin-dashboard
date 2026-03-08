'use client'
import Link from 'next/link'
import React from 'react'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0D1D2D] text-white p-8">

      <div className='max-w-[1320] mx-auto'>
        {/* Welcome Section */}
        <div className="bg-linear-to-r from-[#132C44] to-[#0D1D2D] border border-cyan-800 rounded-xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-[#00B0D3] mb-3">
            Welcome to Admin Dashboard 👋
          </h1>

          <p className="text-gray-300 text-lg max-w-2xl">
            Manage your doctors, services, and appointments easily from this control panel.
            This dashboard gives you full control over your Bone & Joint website content
            and operations.
          </p>

          <div className="mt-6 flex gap-4">

            <Link href={'/doctors'}><button className="bg-green-800  border-2 border-transparent hover:bg-green-900 px-6 py-3 cursor-pointer rounded-lg font-semibold shadow-lg transition">
              Manage Doctors
            </button></Link>


            <Link href={'/services'}><button className="bg-cyan-800 border-2 border-transparent hover:bg-cyan-900 px-6 py-3 cursor-pointer rounded-lg font-semibold shadow-lg transition">
              Manage Services
            </button></Link>

            <Link href={'/appointments'}><button className="bg-gray-300 text-black hover:text-green-500 border-2 border-transparent hover:border-green-800 hover:bg-transparent px-6 py-3 cursor-pointer rounded-lg font-semibold transition">
              View Appointments
            </button></Link>
          </div>
        </div>

        {/* Stats Cards */}
        {/* <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-[#132C44] p-6 rounded-xl border border-cyan-900 hover:border-[#00B0D3] transition">
            <h3 className="text-gray-400 text-sm">Total Doctors</h3>
            <p className="text-3xl font-bold text-[#00B0D3] mt-2">12</p>
          </div>

          <div className="bg-[#132C44] p-6 rounded-xl border border-cyan-900 hover:border-[#00B0D3] transition">
            <h3 className="text-gray-400 text-sm">Total Services</h3>
            <p className="text-3xl font-bold text-[#00B0D3] mt-2">8</p>
          </div>

          <div className="bg-[#132C44] p-6 rounded-xl border border-cyan-900 hover:border-[#00B0D3] transition">
            <h3 className="text-gray-400 text-sm">Appointments</h3>
            <p className="text-3xl font-bold text-[#00B0D3] mt-2">24</p>
          </div>

        </div> */}

        {/* Info Section */}
        <div className="mt-10 bg-[#132C44] border border-cyan-900 rounded-xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold text-[#00B0D3] mb-3">
            Admin Control Panel
          </h2>

          <p className="text-gray-300 leading-relaxed">
            From here you can manage your medical services, doctor profiles,
            and patient appointments. Use the navigation menu above to access
            different modules of the admin panel.
          </p>
        </div>
      </div>

    </div>
  )
}