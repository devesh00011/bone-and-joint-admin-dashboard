import { get_api, post_api } from '@/app/api_helper/api_helper'
import React, { useEffect, useState } from 'react'
import { RiRefreshLine } from 'react-icons/ri'
import Loading from '../../../../Loading'
import Image from 'next/image'
import Swal from 'sweetalert2'

export default function ViewBlogs({ setActiveTab, setEditId }) {

    const [loading, setLoading] = useState(true)
    const [blogsData, setBlogsData] = useState([])

    const fetchBlogs = async () => {
        try {
            setLoading(true)
            const response = await get_api({
                params: null,
                path: 'blog/view-blog-all'
            })
            if (response.status == 200) {
                console.log(response.data.blogs)
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
                                <div className='text-2xl font-bold animate-pulse  text-white'>No Blogs Found</div>
                                :
                                blogsData.map((item, index) => {
                                    return (
                                        <BlogCard fetchBlogs={fetchBlogs} setEditId={setEditId} setActiveTab={setActiveTab} item={item} index={index} />
                                    )
                                })
                    }
                </div>
            </div>
        </div>
    )
}


function BlogCard({ item, index, setActiveTab, setEditId, fetchBlogs }) {

    const [loading, setLoading] = useState(false)
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#00B4D8',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        })

        if (result.isConfirmed) {
            try {
                setLoading(true)

                const response = await post_api({
                    body: {},
                    params: id,
                    path: 'blog/delete'
                })


                if (response.status === 200) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Blog has been deleted successfully.',
                        icon: 'success'
                    })
                    fetchBlogs()
                }

            } catch (error) {
                console.log(error)
                if (error.response.status == 404) {
                    Swal.fire({
                        title: 'Cannot Found Blog to Delete',
                        text: 'Error',
                        icon: 'warning'
                    })
                }
                else {
                    Swal.fire({
                        title: 'Something Went Wrong',
                        text: 'Try again later',
                        icon: 'error'
                    })
                }
            }
            finally {
                setLoading(false)
            }
        }



    }

    return (
        <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between relative"
        >

            <button className='bg-purple-700 text-white absolute top-5 left-5 rounded-full py-1 px-5 '>{item.is_active ? 'Active' : 'Deactive'}</button>

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

                            <h2 className='text-lg font-bold capitalize px-3 py-2 rounded my-2 bg-purple-800 text-white'>all sections with images</h2>
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

                <div className="grid grid-cols-3 justify-between items-center mt-2">
                    <span className="text-sm py-1 border-2 rounded-full text-center text-gray-500">
                        ⏱ {item.blog_read_time} min read
                    </span>

                    <span>{''}</span>
                    <span className="text-white text-center text-md font-semibold rounded-full bg-[#00B0D3] py-1.5">
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
                    className="flex-1 bg-yellow-700 hover:bg-yellow-800 cursor-pointer text-white text-sm font-semibold py-2 rounded-full"
                >
                    Edit
                </button>

                <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 bg-red-700 hover:bg-red-800 cursor-pointer text-white text-sm font-semibold py-2 rounded-full"
                >
                    Delete
                </button>

                <button
                    onClick={() => {
                        setActiveTab('add-section')
                        setEditId(item.id)
                    }}
                    className="flex-1 bg-green-700 hover:bg-green-800 cursor-pointer text-white text-sm font-semibold py-2 rounded-full"
                >
                    Edit Section
                </button>
            </div>
        </div>
    )


}