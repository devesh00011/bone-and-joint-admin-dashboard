'use client'
import React, { useState } from 'react'
import AddBlogs from './components/AddBlogs'
import ViewBlogs from './components/ViewBlogs'
import AddSectionOfBlog from './components/AddSectionOfBlog'


export default function Blogs() {
    const [activeTab, setActiveTab] = useState('add')
    const [editId, setEditId] = useState(null)

    return (
        <div className='bg-gray-800  w-full'>
            <div className='max-w-[1320]  mx-auto flex items-center '>
                <button onClick={() => {
                    setActiveTab('add')
                    setEditId(null)
                }} className='text-white px-10 py-2 text-lg cursor-pointer border-x border-gray-300 hover:bg-white hover:text-black duration-200'>Add Blogs</button>
                <button onClick={() => setActiveTab('view')} className='text-white px-10 py-2 text-lg cursor-pointer border-r border-gray-300 hover:bg-white hover:text-black duration-200'>View Blogs</button>
                <button onClick={() => setActiveTab('add-section')} className='text-white px-10 py-2 text-lg cursor-pointer border-r border-gray-300 hover:bg-white hover:text-black duration-200'>Add Section</button>
            </div>
            <div>
                {activeTab == 'add' && <AddBlogs editId={editId} setEditId={setEditId} />}
                {activeTab == 'view' && <ViewBlogs setEditId={setEditId} setActiveTab={setActiveTab} />}
                {activeTab == 'add-section' && (
                    <AddSectionOfBlog editId={editId} setActiveTab={setActiveTab} />
                )}
            </div>
        </div>
    )
}