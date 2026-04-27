import { get_api } from '@/app/api_helper/api_helper'
import React, { useEffect, useState } from 'react'
import { RiRefreshLine } from 'react-icons/ri'
import Loading from '../../../../Loading'

export default function ViewBlogs() {

    const [loading, setLoading] = useState(true)
    const [blogsData, setBlogsData] = useState([])

    const fetchBlogs = async () => {
        try {
            setLoading(true)
            const response = await get_api({
                params: null,
                path: 'blog/view'
            })
            if (response.status == 200) {
                setBlogsData(response.blogs)
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

                <div className={`grid grid-cols-3`}>
                    {
                        loading ?
                            <Loading />
                            :
                            blogsData.length == 0 ?
                                <div className='text-2xl font-bold max-w-10 mx-auto'>No Blogs Found</div>
                                :
                                blogsData.map((item, index) => {
                                    return 1(
                                        <BlogCard item={item} index={index} />
                                    )
                                })
                    }
                </div>
            </div>
        </div>
    )
}


function BlogCard(item, index) {
    return (
        <div>
            {item.blog_title}
        </div>
    )
}