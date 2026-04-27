'use client'
import React, { useEffect, useRef, useState } from 'react'
import Loading from '../../../../Loading';
import { MdAutoAwesome } from 'react-icons/md';
import { IoIosClose } from 'react-icons/io';
import { get_api, post_api } from '@/app/api_helper/api_helper';
import Swal from 'sweetalert2';
import { FaUserDoctor } from 'react-icons/fa6';

export default function AddServices({ editId, setEditId, setActiveTab }) {

    const fileInputRef = useRef(null)
    const [loading, setLoading] = useState(false)

    const [previewImg, setPreviewImg] = useState('/preview.png')

    const formFields = [
        { name: "service_name", label: "Service Name", type: "text" },
        { name: "service_slug", label: "Slug", type: "text" },
        { name: "short_description", label: "Short Description", type: "text" },
        { name: "full_details", label: "Full Details", type: "text" },
        { name: "meta_title", label: "Meta Title", type: "text", color: 'text-red-500' },
        { name: "meta_description", label: "Meta Description", type: "text", color: 'text-red-500' },
        { name: "service_image", label: "Service Image", type: "file" },
    ]

    const [formData, setFormData] = useState({
        service_name: "",
        service_slug: "",
        short_description: "",
        full_details: "",
        key_benefits: [""],
        commonly_used: [""],
        service_image: null,
        meta_title: "",
        meta_description: "",
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
            const file = files[0]

            setFormData({
                ...formData,
                [name]: file
            })

            if (file) {
                setPreviewImg(URL.createObjectURL(file))
            }
        }
        else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const generateSlug = () => {
        const newSlug = formattedSlug(formData.service_name)
        setFormData({
            ...formData,
            service_slug: newSlug
        })
    }

    const blank_state = () => {
        setFormData({
            service_name: "",
            service_slug: "",
            short_description: "",
            full_details: "",
            key_benefits: [""],
            commonly_used: [""],
            service_image: null,
            meta_title: "",
            meta_description: "",
        })

        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }

        setEditId(null)
        setPreviewImg('/preview.png')
    }

    const formattedSlug = (slug) => {
        return slug
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    //key benefits handlers
    const addKeyBenefits = () => {
        setFormData({
            ...formData,
            key_benefits: [...formData.key_benefits, ""]
        })
    }

    const removeKeyBenefits = (index) => {
        const updatedBenefits = formData.key_benefits.filter((_, i) => i !== index)
        setFormData({ ...formData, key_benefits: updatedBenefits })
    }

    const handleBenefitsChange = (index, value) => {
        const updatedBenefits = [...formData.key_benefits]
        updatedBenefits[index] = value
        setFormData({ ...formData, key_benefits: updatedBenefits })
    }

    //commonly used for handlers
    const addCommonlyUsed = () => {
        setFormData({
            ...formData,
            commonly_used: [...formData.commonly_used, ""]
        })
    }

    const removeCommonlyUsed = (index) => {
        const updatedCommonly = formData.commonly_used.filter((_, i) => i !== index)
        setFormData({ ...formData, commonly_used: updatedCommonly })
    }

    const handleCommonlyChange = (index, value) => {
        const updatedCommonly = [...formData.commonly_used]
        updatedCommonly[index] = value
        setFormData({ ...formData, commonly_used: updatedCommonly })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
            const formDataObj = new FormData(e.target);
            formDataObj.set(
                "key_benefits",
                JSON.stringify(formData.key_benefits)
            );
            formDataObj.set(
                "commonly_used",
                JSON.stringify(formData.commonly_used)
            );
            if (editId) {
                const result = await post_api({
                    body: formDataObj,
                    params: editId,
                    path: `service/update`
                });
                if (result.data.success) {
                    await Swal.fire({
                        title: 'Success!',
                        text: 'Service Updated successfully!',
                        icon: 'success',
                        confirmButtonColor: '#00c4cc',
                    }).then((res) => {
                        if (res.isConfirmed) {
                            blank_state()
                        }
                    })

                } else {
                    Swal.fire({
                        icon: "error",
                        text: "Failed to add service !",
                    });
                }
            }
            else {
                const result = await post_api({
                    body: formDataObj,
                    params: null,
                    path: "service/add",
                });
                if (result.data.success) {
                    await Swal.fire({
                        title: 'Success!',
                        text: 'Services added successfully!',
                        icon: 'success',
                        confirmButtonColor: '#00c4cc',
                    }).then((res) => {
                        if (res.isConfirmed) {
                            //blank form data after success
                            blank_state()
                        }
                    })

                } else {
                    Swal.fire({
                        icon: "error",
                        text: "Failed to add Services!",
                    });
                }
            }
        } catch (error) {

        }
        finally {
            setLoading(false)
        }
    }

    const FillFormDataById = (response) => {
        try {
            const {
                service_name,
                service_slug,
                short_description,
                full_details,
                key_benefits,
                commonly_used,
                service_image,
                meta_title,
                meta_description
            } = response.services

            setFormData({
                service_name,
                service_slug,
                short_description,
                full_details,
                key_benefits,
                commonly_used,
                service_image,
                meta_title,
                meta_description
            })

            if (service_image) {
                setPreviewImg(service_image)
            }

        } catch (error) {
            console.log(error)
            return alert('Cannot fill data from id')
        }
    }

    const fetchServiceById = async () => {
        try {
            const response = await get_api({
                params: editId,
                path: 'service/view'
            })
            if (response.data.success) {
                FillFormDataById(response.data)
            }
            else {
                console.log('Cannot find service to edit')
            }
        } catch (error) {
            console.log(error || 'Server Error')
        }
    }



    useEffect(() => {
        if (editId) {
            fetchServiceById(editId)
        }
    }, [editId])

    return (
        <>
            {loading && <Loading />}
            <div className="w-full bg-[#0D1D2D] min-h-screen p-8 text-white">
                <div className="max-w-[1320] mx-auto bg-[#13293D] p-8 rounded shadow-lg">

                    <h2 className="text-3xl flex items-center gap-2.5 font-bold text-white mb-6">
                        <FaUserDoctor />  {editId ? 'Update Service' : 'Add Service'}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">

                        {/* Dynamic Fields */}
                        {formFields.map((field, index) => (
                            <div key={index} className="flex flex-col">

                                <label className={`${field.color ? `${field.color} text-md font-semibold` : 'text-gray-300 text-sm'} mb-2  `}>
                                    {field.label}
                                </label>

                                {field.type === "textarea" ? (
                                    <textarea
                                        required
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        rows={4}
                                        className="p-3 rounded-md bg-[#0D1D2D] border border-gray-600 focus:border-[#00B0D3] outline-none transition"
                                    />
                                ) : (
                                    <div className="gap-1">
                                        <div className="">
                                            {field.type === "file" && previewImg && (
                                                <img
                                                    ref={fileInputRef}
                                                    src={previewImg}
                                                    alt="Preview"
                                                    className="max-w-[700] max-h-[200] mb-5 object-cover rounded-lg border"
                                                />
                                            )}



                                            <div className='flex items-center gap-5'>
                                                <input
                                                    required={!["checkbox", "file"].includes(field.type)}
                                                    type={field.type}
                                                    name={field.name}
                                                    {...(field.type !== "file" && { value: formData[field.name] })}
                                                    onChange={handleChange}
                                                    className={` flex-1 w-full p-3  rounded-md bg-[#0D1D2D] border border-gray-600 focus:border-[#00B0D3] outline-none transition`}
                                                />
                                                {field.name === 'service_slug' && (
                                                    <span
                                                        onClick={formData.service_name ? generateSlug : undefined}
                                                        className={`text-sm px-2 py-3.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white flex items-center gap-1 rounded-md font-semibold whitespace-nowrap transition-all duration-300 ${!formData.service_name
                                                            ? "opacity-50 cursor-not-allowed pointer-events-none"
                                                            : "cursor-pointer hover:from-purple-700 hover:to-indigo-700"
                                                            }`}
                                                    >
                                                        <MdAutoAwesome className="text-md" />
                                                        Auto
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        ))}

                        {/* Key Benefits Section */}
                        <div className="col-span-3 mt-4">
                            <label className="mb-2 block text-sm text-gray-300">
                                Key Benefits
                            </label>

                            {formData.key_benefits.map((service, index) => (
                                <div key={index} className="flex gap-3 mb-3">

                                    <input
                                        type="text"
                                        value={service}
                                        onChange={(e) =>
                                            handleBenefitsChange(index, e.target.value)
                                        }
                                        className="w-[620] p-3 rounded-md bg-[#0D1D2D] border border-gray-600 focus:border-[#00B0D3] outline-none transition"
                                        placeholder="Enter Benefits"
                                    />

                                    {formData.key_benefits.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeKeyBenefits(index)}
                                            className="px-4 bg-red-500 rounded-md text-lg hover:bg-red-700 transition"
                                        >
                                            <IoIosClose className='text-2xl' />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addKeyBenefits}
                                className="mt-2 px-5 py-2 bg-[#00B0D3] rounded-md hover:bg-cyan-600 transition"
                            >
                                + Add More
                            </button>
                        </div>

                        {/* Commonly Used For Section */}
                        <div className="col-span-3 mt-4">
                            <label className="mb-2 block text-sm text-gray-300">
                                Commonly Used For
                            </label>

                            {formData.commonly_used.map((service, index) => (
                                <div key={index} className="flex gap-3 mb-3">

                                    <input
                                        type="text"
                                        value={service}
                                        onChange={(e) =>
                                            handleCommonlyChange(index, e.target.value)
                                        }
                                        className="w-[620] p-3 rounded-md bg-[#0D1D2D] border border-gray-600 focus:border-[#00B0D3] outline-none transition"
                                        placeholder="Enter Commonly Used For Points"
                                    />

                                    {formData.commonly_used.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeCommonlyUsed(index)}
                                            className="px-4 bg-red-500 rounded-md text-lg hover:bg-red-700 transition"
                                        >
                                            <IoIosClose className='text-2xl' />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addCommonlyUsed}
                                className="mt-2 px-5 py-2 bg-[#00B0D3] rounded-md hover:bg-cyan-600 transition"
                            >
                                + Add More
                            </button>
                        </div>


                        {/* Submit Button */}
                        <div className="col-span-3 mt-6">
                            <button
                                type="submit"
                                className="w-[300] hover:w-[500] transition-all  text-lg bg-[#00B0D3] py-3 rounded-md font-semibold hover:bg-cyan-800 rounded-r-full cursor-pointer duration-300"
                            >
                                {editId ? 'Update Service' : 'Add Service'}
                            </button>
                        </div>

                    </form>

                </div>
            </div>

        </>
    )
}
