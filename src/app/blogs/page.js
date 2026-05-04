'use client'
import React, { useState } from 'react'
import AddBlogs from './components/AddBlogs'
import ViewBlogs from './components/ViewBlogs'
import AddSectionOfBlog from './components/AddSectionOfBlog'
import ViewCategory from './components/ViewCategory'


export default function Blogs() {
    const [activeTab, setActiveTab] = useState('add')
    const [editId, setEditId] = useState(null)

    const [categoryEditId, setCategoryEditId] = useState(null)

    return (
        <div className='bg-gray-800  w-full'>
            <div className='max-w-[1320]  mx-auto flex items-center '>
                <button onClick={() => {
                    setActiveTab('add')
                    setEditId(null)
                }} className='text-white px-10 py-2 text-lg cursor-pointer border-x border-gray-300 hover:bg-white hover:text-black duration-200'>Add Blogs</button>
                <button onClick={() => setActiveTab('view')} className='text-white px-10 py-2 text-lg cursor-pointer border-r border-gray-300 hover:bg-white hover:text-black duration-200'>View Blogs</button>
                {/* <button onClick={() => setActiveTab('add-section')} className='text-white px-10 py-2 text-lg cursor-pointer border-r border-gray-300 hover:bg-white hover:text-black duration-200'>Add Section</button> */}
                <button onClick={() => setActiveTab('view-category')} className='text-white px-10 py-2 text-lg cursor-pointer border-r border-gray-300 hover:bg-white hover:text-black duration-200'>View Category</button>
            </div>
            <div>
                {activeTab == 'add' && <AddBlogs categoryEditId={categoryEditId} setCategoryEditId={setCategoryEditId} editId={editId} setEditId={setEditId} />}
                {activeTab == 'view' && <ViewBlogs setEditId={setEditId} setActiveTab={setActiveTab} />}
                {activeTab == 'add-section' && (
                    <AddSectionOfBlog editId={editId} setActiveTab={setActiveTab} />
                )}
                {activeTab == 'view-category' && <ViewCategory setEditId={setEditId} setActiveTab={setActiveTab} setCategoryEditId={setCategoryEditId} />}

            </div>
        </div>
    )
}