'use client'
import React, { useEffect, useState } from 'react'
import { MdAutoAwesome, MdStars } from 'react-icons/md'
import { IoIosClose } from "react-icons/io";
import { FaUserDoctor } from 'react-icons/fa6';
import { get_api, post_api } from '@/app/api_helper/api_helper';
import Swal from 'sweetalert2';
import Loading from '../../../../Loading';

export default function AddDoctors({ editId }) {
    const formFields = [
        { name: "name", label: "Doctor Name", type: "text" },
        { name: "slug", label: "Slug", type: "text" },
        { name: "post_name", label: "Post Name", type: "text" },
        { name: "primary_specialization", label: "Primary Specialization", type: "text" },
        { name: "experience_year", label: "Experience (Years)", type: "number" },
        { name: "phone_number", label: "Phone Number", type: "text" },
        { name: "email", label: "Email", type: "email" },
        { name: "profile_image", label: "Profile Image URL", type: "file" },
        { name: "short_description", label: "Short Description", type: "textarea" },
        { name: "full_bio", label: "Full Bio", type: "textarea" },
        { name: "meta_title", label: "Meta Title", type: "text", color: 'text-red-500' },
        { name: "meta_description", label: "Meta Description", type: "text", color: 'text-red-500' },

    ]

    // console.log('editId', editId);

    const [loading, setLoading] = useState(false)


    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        post_name: "",
        primary_specialization: "",
        experience_year: 0,
        phone_number: "",
        email: "",
        profile_image: null,
        short_description: "",
        full_bio: "",
        other_services: [""],
        is_active: true,
        is_featured: false,
        meta_title: "",
        meta_description: '',
    })

    const formattedSlug = (slug) => {
        return slug
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    const generateSlug = () => {
        const newSlug = formattedSlug(formData.name)
        setFormData({
            ...formData,
            slug: newSlug
        })
    }

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

    const handleServiceChange = (index, value) => {
        const updatedServices = [...formData.other_services]
        updatedServices[index] = value
        setFormData({ ...formData, other_services: updatedServices })
    }

    const addService = () => {
        setFormData({
            ...formData,
            other_services: [...formData.other_services, ""]
        })
    }

    const removeService = (index) => {
        const updatedServices = formData.other_services.filter((_, i) => i !== index)
        setFormData({ ...formData, other_services: updatedServices })
    }

    const blank_state = () => {
        setFormData({
            name: "",
            slug: "",
            post_name: "",
            primary_specialization: "",
            experience_year: 0,
            phone_number: "",
            email: "",
            profile_image: "",
            short_description: "",
            full_bio: "",
            other_services: [""],
            is_active: true,
            is_featured: false,
            meta_title: "",
            meta_description: '',
        })
    }

    const fetchDoctorById = async (editId) => {
        try {
            const response = await get_api({
                params: editId,
                path: 'doctor/view'
            })
            if (response.data.success) {
                const { name, slug, post_name, experience_year, phone_number, email, profile_image, short_description, full_bio, other_services, is_active, is_featured, meta_title, meta_description, primary_specialization } = response.data.result
                setFormData({
                    name,
                    slug,
                    post_name,
                    primary_specialization,
                    experience_year,
                    phone_number,
                    email,
                    profile_image,
                    short_description,
                    full_bio,
                    other_services,
                    is_active,
                    is_featured,
                    meta_title,
                    meta_description,
                })
            }
            else {
                console.log('Cannot found Doctor to edit')
            }
        } catch (error) {
            console.log(error || 'Server Error')
        }
    }

    useEffect(() => {
        if (editId) {
            fetchDoctorById(editId)
        }
    }, [editId])


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataObj = new FormData(e.target);

            formDataObj.set("is_active", formData.is_active.toString());
            formDataObj.set("is_featured", formData.is_featured.toString());

            formDataObj.set(
                "other_services",
                JSON.stringify(formData.other_services)
            );

            if (editId) {
                const result = await post_api({
                    body: formDataObj,
                    params: editId,
                    path: `doctor/update`
                });
                if (result.data.success) {
                    await Swal.fire({
                        title: 'Success!',
                        text: 'Doctor Updated successfully!',
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
                        text: "Failed to add doctor!",
                    });
                }
            }
            else {
                const result = await post_api({
                    body: formDataObj,
                    params: null,
                    path: "doctor/add",
                });
                if (result.data.success) {
                    await Swal.fire({
                        title: 'Success!',
                        text: 'Doctor added successfully!',
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
                        text: "Failed to add doctor!",
                    });
                }
            }

        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: "error",
                text: "Something went wrong!",
            });
        } finally {
            setLoading(false); //remove loader after api take responsed
        }
    };


    return (
        <>
            {loading && <Loading />}
            <div className="w-full bg-[#0D1D2D] min-h-screen p-8 text-white">
                <div className="max-w-[1320] mx-auto bg-[#13293D] p-8 rounded shadow-lg">

                    <h2 className="text-3xl flex items-center gap-2.5 font-bold text-white mb-6">
                        <FaUserDoctor />  {editId ? 'Update Doctor' : 'Add Doctor'}
                    </h2>

                    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-6">

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
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-3">
                                            {field.type === "file" && formData.profile_image && typeof formData.profile_image === "string" && (
                                                <img
                                                    src={formData.profile_image}
                                                    alt="Profile Preview"
                                                    className="w-15 h-15 object-cover rounded-lg border"
                                                />
                                            )}
                                            <input
                                                required={!["checkbox", "file"].includes(field.type)}
                                                type={field.type}
                                                name={field.name}
                                                {...(field.type !== "file" && { value: formData[field.name] })}
                                                onChange={handleChange}
                                                className={` flex-1 w-full p-3 rounded-md bg-[#0D1D2D] border border-gray-600 focus:border-[#00B0D3] outline-none transition`}
                                            />


                                            {field.name === 'slug' && (
                                                <span
                                                    onClick={formData.name ? generateSlug : undefined}
                                                    className={`text-sm px-2 py-3.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white flex items-center gap-1 rounded-md font-semibold whitespace-nowrap transition-all duration-300 ${!formData.name
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
                                )}

                            </div>
                        ))}

                        {/* Other Services Section */}
                        <div className="col-span-3 mt-4">
                            <label className="mb-2 block text-sm text-gray-300">
                                Other Services
                            </label>

                            {formData.other_services.map((service, index) => (
                                <div key={index} className="flex gap-3 mb-3">

                                    <input
                                        type="text"
                                        value={service}
                                        onChange={(e) =>
                                            handleServiceChange(index, e.target.value)
                                        }
                                        className="w-[620] p-3 rounded-md bg-[#0D1D2D] border border-gray-600 focus:border-[#00B0D3] outline-none transition"
                                        placeholder="Enter service"
                                    />

                                    {formData.other_services.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeService(index)}
                                            className="px-4 bg-red-500 rounded-md text-lg hover:bg-red-700 transition"
                                        >
                                            <IoIosClose className='text-2xl' />
                                        </button>
                                    )}
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addService}
                                className="mt-2 px-5 py-2 bg-[#00B0D3] rounded-md hover:bg-cyan-600 transition"
                            >
                                + Add More
                            </button>
                        </div>

                        {/* Checkboxes */}
                        <div className="flex items-center gap-6 col-span-3 mt-4">

                            <label className="flex items-center gap-2 text-lg">
                                <input
                                    type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={handleChange}
                                    className="accent-[#00B0D3] w-8 h-5 "
                                />
                                Active
                            </label>

                            <label className="flex items-center gap-2 text-lg">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleChange}
                                    className="accent-[#00B0D3] w-8 h-5 "
                                />
                                Featured
                            </label>

                        </div>

                        {/* Submit Button */}
                        <div className="col-span-3 mt-6">
                            <button
                                type="submit"
                                className="w-[300] hover:w-[500] transition-all  text-lg bg-[#00B0D3] py-3 rounded-md font-semibold hover:bg-cyan-800 rounded-r-full cursor-pointer duration-300"
                            >
                                {editId ? 'Update Doctor' : 'Add Doctor'}
                            </button>
                        </div>

                    </form>

                </div>
            </div>

        </>

    )
}

