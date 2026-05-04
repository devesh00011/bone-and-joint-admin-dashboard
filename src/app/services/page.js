'use client'
import React, { useState } from 'react'
import AddServices from './components/AddServices'
import ViewServices from './components/ViewServices'
import AddServicesVideos from './components/AddServicesVideos'


export default function Page() {
    const [activeTab, setActiveTab] = useState('add')
    const [editId, setEditId] = useState(null)

    return (
        <div className='bg-gray-800 w-full'>
            <div className='max-w-[1320]   mx-auto flex items-center '>
                <button onClick={() => {
                    setActiveTab('add')
                    setEditId(null)
                }} className='text-white px-10 py-2 text-lg cursor-pointer border-x border-gray-300 hover:bg-white hover:text-black duration-200'>Add Service</button>
                <button onClick={() => setActiveTab('view')} className='text-white px-10 py-2 text-lg cursor-pointer border-r border-gray-300 hover:bg-white hover:text-black duration-200'>View Service</button>
                <button onClick={() => setActiveTab('add-videos')} className='text-white px-10 py-2 text-lg cursor-pointer border-r border-gray-300 hover:bg-white hover:text-black duration-200'>Add Services Videos</button>
            </div>
            <div>
                {activeTab == 'add' && <AddServices setEditId={setEditId} editId={editId} setActiveTab={setActiveTab} />}
                {activeTab == 'view' && <ViewServices setEditId={setEditId} setActiveTab={setActiveTab} />}
                {activeTab == 'add-videos' && <AddServicesVideos editId={editId} setEditId={setEditId} setActiveTab={setActiveTab} />}
            </div>
        </div>
    )
}