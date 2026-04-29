import { get_api } from '@/app/api_helper/api_helper'
import React, { useEffect, useState } from 'react'
import { RiRefreshLine } from 'react-icons/ri'
import Loading from '../../../../Loading'
import Image from 'next/image'

export default function ViewBlogs({ setActiveTab, setEditId }) {

    const [loading, setLoading] = useState(true)
    const [blogsData, setBlogsData] = useState([])

    const fetchBlogs = async () => {
        try {
            setLoading(true)
            const response = await get_api({
                params: null,
                path: 'blog/view-blog'
            })
            if (response.status == 200) {
                console.log(response)
                setBlogsData(response.data.blogs)
            }
            else {
                setBlogsData([])
            }
        } catch (error) {
            setBlogsData([])
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])


    return (
        <div className="w-full bg-[#0D1D2D] min-h-screen p-8 text-white">

            <div className="max-w-[1320] mx-auto bg-[#13293D] p-8 rounded shadow-lg"
            >
                <div className="flex items-center justify-between text-white">
                    <h2 className="text-3xl  font-bold text-white mb-8">
                        All Blogs
                    </h2>
                    <span onClick={() => fetchBlogs()} className="flex items-center gap-1 cursor-pointer hover:text-cyan-500 duration-100"><RiRefreshLine /> Refresh </span>
                </div>

                <div className={`grid grid-cols-2 gap-x-7 gap-y-10`}>
                    {
                        loading ?
                            <Loading />
                            :
                            blogsData.length == 0 ?
                                <div className='text-2xl font-bold max-w-10 mx-auto'>No Blogs Found</div>
                                :
                                blogsData.map((item, index) => {
                                    return (
                                        <BlogCard setEditId={setEditId} setActiveTab={setActiveTab} item={item} index={index} />
                                    )
                                })
                    }
                </div>
            </div>
        </div>
    )
}


function BlogCard({ item, index, setActiveTab, setEditId }) {
    // console.log(item)
    return (
        <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between"
        >

            {/* Image + Sections */}
            <div className="grid grid-cols-2 gap-2">

                {/* Blog Image */}
                <img
                    src={item.blog_image}
                    alt={item.blog_title}
                    className="w-full h-48 object-cover"
                />

                {/* Sections */}
                <div className="p-2 overflow-y-auto scrollbar max-h-48">
                    {item.sections && item.sections.length > 0 ? (
                        <>

                            <h2 className='text-lg font-bold capitalize px-3 py-2 rounded my-2 bg-[#00B0D3] text-white'>all sections with images</h2>
                            {item.sections.slice(0, 3).map((sec, secIndex) => (
                                <div
                                    key={secIndex}
                                    className="mb-2 p-5 bg-gray-100 rounded-lg"
                                >

                                    {/* Section Image (optional) */}
                                    {sec.section_image && (
                                        <img
                                            src={sec.section_image}
                                            alt={sec.section_title}
                                            className="w-full h-20 object-cover rounded my-3"
                                        />
                                    )}

                                    <h2 className="font-bold text-sm mb-1 text-black line-clamp-1 flex items-center gap-1">
                                        <span className='text-[#00B0D3]'>Section {secIndex + 1}</span>({item.blog_title})
                                    </h2>

                                    {sec.section_short_description && (
                                        <p className="text-xs text-gray-600 line-clamp-2">
                                            {sec.section_short_description}
                                        </p>
                                    )}


                                </div>
                            ))}

                            {/* Show More */}
                            {item.sections.length > 3 && (
                                <p className="text-xs text-blue-500">
                                    +{item.sections.length - 3} more sections...
                                </p>
                            )}
                        </>
                    ) : (
                        <div className='flex my-20 text-center justify-center'>
                            <p className="text-lg font-semibold  text-gray-400">
                                No sections added
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 text-black flex-1">
                <h2 className="font-bold text-lg mb-1 line-clamp-1">
                    {item.blog_title}
                </h2>

                <p className="text-gray-600 text-sm line-clamp-2">
                    {item.blog_full_description}
                </p>

                <div className="grid grid-cols-2 items-center mt-2">
                    <span className="text-sm text-gray-500">
                        ⏱ {item.blog_read_time} min read
                    </span>

                    <span className="text-white text-center text-xs font-semibold rounded bg-[#00B0D3] px-4 py-2.5">
                        By {item.blog_author_name}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-2 px-5 py-3 border-t bg-gray-50">

                <button
                    onClick={() => {
                        setActiveTab('add')
                        setEditId(item.id)
                    }}
                    className="flex-1 bg-yellow-700 hover:bg-yellow-800 cursor-pointer text-white text-sm font-semibold py-2 rounded-md"
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-700 hover:bg-red-800 cursor-pointer text-white text-sm font-semibold py-2 rounded-md"
                >
                    Delete
                </button>

                <button
                    onClick={() => {
                        setActiveTab('add-section')
                        setEditId(item.id)
                    }}
                    className="flex-1 bg-green-700 hover:bg-green-800 cursor-pointer text-white text-sm font-semibold py-2 rounded-md"
                >
                    Edit Section
                </button>
            </div>
        </div>
    )

}