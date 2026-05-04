'use client'
import React, { useEffect, useState } from 'react'
import Loading from '../../../../Loading'
import Swal from 'sweetalert2'
import { get_api, post_api } from '@/app/api_helper/api_helper'
import { MdAutoAwesome } from 'react-icons/md'

export default function AddBlogs({ editId, setEditId, categoryEditId, setCategoryEditId }) {

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
        meta_description: "",
        blog_category_id: ""
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
        setFormData({
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
        setEditId()
    }

    const saveBlog = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const formDataObj = new FormData(e.target);

            formDataObj.set("is_active", formData.is_active.toString());

            if (!formData.blog_category_id) {
                formDataObj.delete("blog_category_id"); // ✅ remove field
            }

            if (editId) {
                //update logic
                const response = await post_api({
                    body: formDataObj,
                    params: editId,
                    path: 'blog/update-blog'
                })
                if (response.status == 200) {
                    Swal.fire({
                        title: 'Blog Updated Successfully',
                        text: 'Success ',
                        icon: 'success'
                    }).then((res) => {
                        if (res.isConfirmed) {
                            blankState()
                        }
                    })
                }
                else {
                    Swal.fire({
                        title: 'Cannot Update Blog',
                        text: 'Try Again Later ',
                        icon: 'error'
                    })
                }
            }
            else {
                const response = await post_api({
                    body: formDataObj,
                    params: null,
                    path: 'blog/add-blog'
                })
                if (response.status == 200) {
                    Swal.fire({
                        title: 'Blog Added Successfully ',
                        text: 'Success',
                        icon: 'success'
                    }).then((res) => {
                        if (res.isConfirmed) {
                            blankState()
                        }
                    })
                }
            }
        } catch (error) {
            if (error.response.status == 409) {
                Swal.fire({
                    title: 'Blog Image Is Required',
                    text: 'Add One Image to Continue',
                    icon: 'warning'
                })
            }
            if (error.response.status == 500) {
                Swal.fire({
                    title: 'Cannot Add Blogs',
                    text: 'Try Again Later',
                    icon: 'error'
                })
            }
            if (error.response.status == '23505') {
                Swal.fire({
                    title: 'Slug Already Added Before',
                    text: 'Try Different One',
                    icon: 'warning'
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
            if (categoryEditId) {
                //update category 
                const response = await post_api({
                    body: { blogCategory },
                    params: categoryEditId,
                    path: 'blog/update-category'
                })
                if (response.status == 200) {
                    Swal.fire({
                        title: 'Success',
                        text: ' Blog Category Updated Successfully',
                        icon: 'success'
                    }).then((res) => {
                        if (res.isConfirmed) {
                            setBlogCategory('')
                            setCategoryEditId(null)

                        }
                    })
                }
            }
            else {
                const response = await post_api({
                    body: { blogCategory },
                    params: null,
                    path: 'blog/add-category'
                })
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

    const fetchBlogs = async () => {
        try {
            setLoading(true)

            const response = await get_api({
                params: editId,
                path: `blog/view-blog`
            })

            if (response.status == 200) {
                let b = response.data.result
                setFormData({
                    blog_title: b.blog_title,
                    blog_slug: b.blog_slug,
                    blog_image: b.blog_image,
                    blog_full_description: b.blog_full_description,
                    blog_author_name: b.blog_author_name,
                    blog_read_time: b.blog_read_time,
                    is_active: true,
                    meta_title: b.meta_title,
                    meta_description: b.meta_description,
                    blog_category_id: b.blog_category_id
                })
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategoryById = async () => {
        try {
            const response = await get_api({
                params: categoryEditId,
                path: 'blog/view-category'
            })
            if (response.status == 200) {
                console.log('edit response', response.data.category.category_name)
                setBlogCategory(response.data.category.category_name)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if (editId) {
            fetchBlogs()
        }
    }, [editId])

    useEffect(() => {
        fetchAllCategories()
    }, [])

    useEffect(() => {
        if (categoryEditId) {
            fetchCategoryById()
        }
    }, [categoryEditId])

    return (
        <>
            {loading && <Loading />}

            <div className="w-full bg-[#0D1D2D] min-h-screen p-8 text-white">
                <div className="max-w-[1320] mx-auto bg-[#085160] p-8 rounded-lg shadow-lg">
                    <div>
                        <p className='text-3xl font-bold mb-2 text-white'>{categoryEditId ? 'Update Category' : 'Add Category'}</p>
                        <form onSubmit={saveCategory} className='flex items-center gap-5'>
                            <input value={blogCategory} required onChange={(e) => setBlogCategory(e.target.value)} className='px-5 py-3 w-[500] rounded-lg bg-[#0D1D2D] border border-gray-600 focus:border-[#00B0D3] outline-none transition' type='text' />
                            <button type='submit' className='block bg-[#00B0D3] hover:bg-[#00262e] duration-300 text-white rounded-lg cursor-pointer px-7 py-3 my-5 '>{categoryEditId ? 'Update Category' : 'Add Category'}</button>
                        </form>
                    </div>
                </div>
                <div className="max-w-[1320] mx-auto mt-10 bg-[#13293D] p-8 rounded-lg shadow-lg">
                    <div>
                        <div className='text-3xl font-bold mb-4'>{editId ? 'Update Blog' : 'Add Blog'}
                            <div className='w-24 h-1 rounded-full bg-[#00B0D3] mt-1.5'></div>
                        </div>
                        <form onSubmit={saveBlog} className='gap-3'>
                            <p className='mb-1 font-semibold'>Select Category</p>
                            <div className='grid grid-cols-2 gap-5'>
                                <select
                                    name="blog_category_id"
                                    value={formData.blog_category_id || ""}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            blog_category_id: e.target.value || ""
                                        })
                                    }
                                    disabled={categoryLoading}
                                    className='px-5 py-3 w-full cursor-pointer rounded-lg bg-[#0D1D2D] border border-gray-600'
                                >
                                    <option value="">Select Category</option>

                                    {categoryLoading ? (
                                        <option disabled>Loading...</option>
                                    ) : allCategories.length === 0 ? (
                                        <option value="" disabled>No Categories Found</option>
                                    ) : (
                                        allCategories.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.category_name}
                                            </option>
                                        ))
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
                                                required
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

                                                {
                                                    field.name === "blog_image" && formData.blog_image && typeof formData.blog_image === "string" && (
                                                        <img
                                                            src={formData.blog_image}
                                                            className="w-40 h-40 object-cover rounded"
                                                        />

                                                    )
                                                }

                                                {field.name === 'blog_image' && field.type == 'file' && <p className='text-sm text-red-400'>Must Add Image For Create Blog</p>}


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
                            <button className="w-[200] hover:w-[400] my-10 transition-all  text-lg bg-[#00B0D3] py-3 rounded-md font-semibold hover:bg-cyan-800 rounded-r-full cursor-pointer duration-300" type='submit'>{editId ? 'Update Blog' : 'Add Blog'}</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
