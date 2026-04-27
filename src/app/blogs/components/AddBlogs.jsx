'use client'
import React, { useEffect, useState } from 'react'
import Loading from '../../../../Loading'
import Swal from 'sweetalert2'
import { get_api, post_api } from '@/app/api_helper/api_helper'
import { MdAutoAwesome } from 'react-icons/md'

export default function AddBlogs({ editId }) {
    const [loading, setLoading] = useState(false)
    const [categoryLoading, setCategoryLoading] = useState(false)

    const [blogCategory, setBlogCategory] = useState('')
    const [allCategories, setAllCategories] = useState([])

    const formFields = [
        { name: "blog_title", label: "Blog Title", type: "text" },
        { name: "blog_slug", label: "Blog Slug", type: "text" },
        { name: "blog_image", label: "Blog Image", type: "file" },
        { name: "blog_full_description", label: "Blog Description", type: "textarea" },
        { name: "blog_author_name", label: "Author Name", type: "text" },
        { name: "blog_read_time", label: "Read Time (min)", type: "number" },
        { name: "is_active", label: "Is Active", type: "checkbox" },
        { name: "meta_title", label: "Meta Title", type: "text" },
        { name: "meta_description", label: "Meta Description", type: "textarea" },
    ]

    const [formData, setFormData] = useState({
        blog_title: "",
        blog_slug: "",
        blog_image: null,
        blog_full_description: "",
        blog_author_name: "",
        blog_read_time: "",
        is_active: true,
        meta_title: "",
        meta_description: ""
    })

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked
            });
        }
        else if (type === "file") {
            setFormData({
                ...formData,
                [name]: files[0]   // 👈 store actual file object
            });
        }
        else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const blankState = () => {
        alert('blank state')
    }

    const saveBlog = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formDataObj = new FormData(e.target);

            formDataObj.set("is_active", formData.is_active.toString());

            if (editId) {
                //update logic
            }
            else {
                const response = await post_api({
                    body: formDataObj,
                    params: null,
                    path: 'blog/add-blog'
                })
                if (response.status == 200) {
                    Swal.fire({
                        title: 'Success',
                        text: 'Blog Added Successfully ',
                        icon: 'success'
                    }).then((res) => {
                        if (res.isConfirmed) {
                            blankState()
                        }
                    })
                }
            }
        } catch (error) {
            if (error.response.status == 500) {
                Swal.fire({
                    title: 'Cannot Add Blogs',
                    text: 'Try Again Later',
                    icon: 'error'
                })
            }
        }
        finally {
            setLoading(false)
        }
    }

    const saveCategory = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await post_api({
                body: { blogCategory },
                params: null,
                path: 'blog/add-category'
            })
            console.log(response)
            if (response.status == 200) {
                Swal.fire({
                    title: 'Success',
                    text: ' Blog Category Added Successfully',
                    icon: 'success'
                }).then((res) => {
                    if (res.isConfirmed) {
                        setBlogCategory('')
                    }
                })
            }
        } catch (error) {
            if (error.response?.status === 409) {
                Swal.fire({
                    title: 'Category Already Exists',
                    text: 'Try a different one',
                    icon: 'warning'
                })
            } else {
                Swal.fire({
                    icon: "error",
                    text: "Try again later!",
                    title: 'Something went wrong'
                })
            }
        }
        finally {
            setLoading(false)
        }
    }

    const formattedSlug = (slug) => {
        return slug
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    const generateSlug = () => {
        const newSlug = formattedSlug(formData.blog_title)

        setFormData((prev) => ({
            ...prev,
            blog_slug: newSlug
        }))
    }

    const fetchAllCategories = async () => {
        try {
            setCategoryLoading(true)
            const response = await get_api({
                params: null,
                path: 'blog/view-category'
            })
            if (response.status == 200) {
                setAllCategories(response.data.result)
                console.log(response.data.result)
            }
        } catch (error) {
            if (error.response.status == 404) {
                setAllCategories([])
                console.log('No Blogs Category Found')
            }
        }
        finally {
            setCategoryLoading(false)
        }
    }

    useEffect(() => {
        fetchAllCategories()
    }, [])

    console.log(blogCategory)

    return (
        <>
            {loading && <Loading />}

            <div className="w-full bg-[#0D1D2D] min-h-screen p-8 text-white">
                <div className="max-w-[1320] mx-auto bg-[#085160] p-8 rounded-lg shadow-lg">
                    <div>
                        <p className='text-3xl font-bold mb-2 text-white'>Add Category</p>
                        <form onSubmit={saveCategory} className='flex items-center gap-5'>
                            <input value={blogCategory} required onChange={(e) => setBlogCategory(e.target.value)} className='px-5 py-3 w-[500] rounded-lg bg-[#0D1D2D] border border-gray-600 focus:border-[#00B0D3] outline-none transition' type='text' />
                            <button type='submit' className='block bg-[#00B0D3] hover:bg-[#00262e] duration-300 text-white rounded-lg cursor-pointer px-10 py-3 my-5 '>Save</button>
                        </form>
                    </div>
                </div>
                <div className="max-w-[1320] mx-auto mt-10 bg-[#13293D] p-8 rounded-lg shadow-lg">
                    <div>
                        <div className='text-3xl font-bold mb-4'>Add Blogs
                            <div className='w-24 h-1 rounded-full bg-[#00B0D3] mt-1.5'></div>
                        </div>
                        <form onSubmit={saveBlog} className='gap-3'>
                            <p className='mb-1 font-semibold'>Select Category</p>
                            <div className='grid grid-cols-2 gap-5'>
                                <select
                                    value={formData.category_id || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category_id: e.target.value })
                                    }
                                    disabled={categoryLoading}
                                    className='px-5 py-3 w-full cursor-pointer rounded-lg bg-[#0D1D2D] border border-gray-600'
                                >
                                    {categoryLoading ? (
                                        <option>Loading...</option>
                                    ) : allCategories.length === 0 ? (
                                        <option>No Categories Found</option>
                                    ) : (
                                        <>
                                            <option value="">Select Category</option>
                                            {allCategories.map((item) => (
                                                <option key={item.id} value={item.id}>
                                                    {item.category_name}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {formFields.map((field, index) => (
                                    <div key={index} className="flex flex-col">

                                        <label className="text-gray-300 text-sm my-2">
                                            {field.label}
                                        </label>

                                        {field.type === "textarea" ? (
                                            <textarea
                                                name={field.name}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                rows={4}
                                                className="p-3 rounded-md bg-[#0D1D2D] border border-gray-600"
                                            />
                                        ) : field.type === "checkbox" ? (
                                            <input
                                                type="checkbox"
                                                name={field.name}
                                                checked={formData[field.name]}
                                                onChange={handleChange}
                                                className="w-5 h-5 cursor-pointer"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">

                                                <input
                                                    type={field.type}
                                                    name={field.name}
                                                    value={field.type !== "file" ? formData[field.name] : undefined}
                                                    onChange={handleChange}
                                                    className="w-full p-3 rounded-md bg-[#0D1D2D] border border-gray-600"
                                                />

                                                {/* Slug Auto Button */}
                                                {field.name === "blog_slug" && (
                                                    <button
                                                        type="button"
                                                        onClick={generateSlug}
                                                        className="px-3 py-3 flex items-center gap-2 bg-linear-to-r from-purple-600 to-indigo-600 hover:brightness-75 duration-300 text-white cursor-pointer  rounded"
                                                    >
                                                        <MdAutoAwesome className="text-md" />
                                                        Auto
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                ))}

                            </div>
                            <button className="my-5 bg-[#00B0D3] font-semibold hover:brightness-75 duration-300 cursor-pointer px-5 py-3 rounded-md" type='submit'>Add Blog</button>

                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
