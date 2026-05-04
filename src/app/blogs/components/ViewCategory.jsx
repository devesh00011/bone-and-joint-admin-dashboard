'use client'
import { get_api, post_api } from '@/app/api_helper/api_helper'
import React, { useEffect, useState } from 'react'
import { MdDelete, MdEdit } from 'react-icons/md'
import { RiRefreshLine } from 'react-icons/ri'
import Loading from '../../../../Loading'
import Swal from 'sweetalert2'

export default function ViewCategory({ setActiveTab, setCategoryEditId }) {

    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])


    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await get_api({
                params: null,
                path: 'blog/view-category'
            })
            if (response.status == 200) {
                setCategories(response.data.result)
            }
            else {
                setCategories([])
            }
        } catch (error) {
            setCategories([])
            console.log(error.message || 'Server Error')
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const deleteCategory = async (id) => {

        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This category will be permanently deleted!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (!confirm) return;


        try {
            setLoading(true)
            const response = await post_api({
                body: {},
                params: id,
                path: 'blog/delete-category'
            })
            if (response.status == 200) {
                Swal.fire({
                    text: 'Category Deleted Successfully',
                    title: 'Success',
                    icon: 'success'
                })
                fetchCategories()
            }
        } catch (error) {
            console.log(error.message || 'Server Error')
            if (error.response.status == 404) {
                Swal.fire({
                    text: 'Cannot Delete Category ',
                    title: 'Something Went Wrong !',
                    icon: 'error'
                })
            }
            else {
                Swal.fire({
                    text: 'Try Again Later ',
                    title: 'Something Went Wrong !',
                    icon: 'error'
                })
            }
        }

        finally {
            setLoading(false)
        }
    }


    return (
        <div className="w-full bg-[#0D1D2D] min-h-screen p-8 text-white">
            <div className="max-w-[1320] mx-auto bg-[#13293D] p-8 rounded shadow-lg"
            >
                <div className="flex items-center justify-between text-white">
                    <h2 className="text-3xl  font-bold text-white mb-8">
                        All Blogs Categories
                    </h2>
                    <span onClick={() => fetchCategories()} className="flex items-center gap-1 cursor-pointer hover:text-cyan-500 duration-100"><RiRefreshLine /> Refresh </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-md">
                        <thead>
                            <tr className="text-white border-b border-[#214761]">
                                <th className="py-4 px-4 text-left">Category Name</th>
                                <th className="py-4 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                loading ? <Loading />
                                    : categories.length === 0 ? (
                                        <tr>
                                            <td colSpan="2" className='text-3xl animate-pulse font-bold text-center py-10'>No Category Found</td>
                                        </tr>
                                    ) : (
                                        categories.map((item, index) => (
                                            <tr key={index} className="border-b border-[#214761] cursor-pointer duration-300 hover:bg-cyan-950 ">
                                                <td className='py-4 px-4 text-left'>{item.category_name}</td>

                                                <td className="py-4 px-4 text-right flex items-center justify-end" >
                                                    <div className='flex items-center gap-4'>

                                                        {/* Edit Button */}
                                                        <button
                                                            onClick={() => {
                                                                setActiveTab('add')
                                                                setCategoryEditId(item.id)
                                                            }
                                                            }
                                                            className="text-xl rounded text-white bg-cyan-500 p-2 hover:bg-cyan-900 duration-200 cursor-pointer"
                                                            title="Edit"
                                                        >
                                                            <MdEdit />
                                                        </button>

                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={() => deleteCategory(item.id)}
                                                            className="text-xl rounded text-white bg-red-700 hover:bg-red-900 p-2 duration-200 cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <MdDelete />
                                                        </button>

                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )
                            }
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
    )
}
