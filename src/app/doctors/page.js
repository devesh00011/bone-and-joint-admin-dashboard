'use client'
import React, { useState } from 'react'
import AddDoctors from './components/AddDoctors'
import ViewDoctors from './components/ViewDoctors'


export default function DoctorForm() {
    const [activeTab, setActiveTab] = useState('add')
    const [editId, setEditId] = useState(null)

    return (
        <div className='bg-gray-800  w-full'>
            <div className='max-w-[1320]  mx-auto flex items-center '>
                <button onClick={() => {
                    setActiveTab('add')
                    setEditId(null)
                }} className='text-white px-10 py-2 text-lg cursor-pointer border-x border-gray-300 hover:bg-white hover:text-black duration-200'>Add Doctor</button>
                <button onClick={() => setActiveTab('view')} className='text-white px-10 py-2 text-lg cursor-pointer border-r border-gray-300 hover:bg-white hover:text-black duration-200'>View Doctor</button>
            </div>
            <div>
                {activeTab == 'add' && <AddDoctors editId={editId} />}
                {activeTab == 'view' && <ViewDoctors setEditId={setEditId} setActiveTab={setActiveTab} />}
            </div>
        </div>
    )
}