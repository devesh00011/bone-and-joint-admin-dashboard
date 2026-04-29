'use client'
import { get_api, post_api } from '@/app/api_helper/api_helper'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Loading from '../../../../Loading'

export default function AddSectionOfBlog({ editId }) {



    const [loading, setLoading] = useState(false)

    const [sections, setSections] = useState([
        {
            section_title: '',
            section_short_description: '',
            section_full_description: '',
            section_image: null,
            subItems: [
                {
                    section_sub_heading: '',
                    section_sub_points: ['']
                }
            ]
        }
    ])

    const addPoint = (secIndex, subIndex) => {
        const updated = [...sections]
        updated[secIndex].subItems[subIndex].section_sub_points.push('')
        setSections(updated)
    }

    const handlePointChange = (secIndex, subIndex, pointIndex, value) => {
        const updated = [...sections]
        updated[secIndex].subItems[subIndex].section_sub_points[pointIndex] = value
        setSections(updated)
    }

    // 🔹 Section change
    const handleSectionChange = (index, field, value) => {
        const updated = [...sections]
        updated[index][field] = value
        setSections(updated)
    }

    // 🔹 Sub item change
    const handleSubChange = (secIndex, subIndex, field, value) => {
        const updated = [...sections]
        updated[secIndex].subItems[subIndex][field] = value
        setSections(updated)
    }

    // 🔹 Remove Entire Section

    const removeSection = (index) => {
        const updated = [...sections]

        if (updated.length > 1) {
            updated.splice(index, 1)
            setSections(updated)
        }
    }

    // 🔹 Add new section
    const addSection = () => {
        setSections(prev => [
            ...prev,
            {
                section_title: '',
                section_short_description: '',
                section_full_description: '',
                section_image: null,
                subItems: [
                    {
                        section_sub_heading: '',
                        section_sub_points: ['']
                    }
                ]
            }
        ])
    }

    // 🔹 Add sub item
    const addSubItem = (index) => {
        const updated = [...sections]
        updated[index].subItems.push({
            section_sub_heading: '',
            section_sub_points: ['']   // ✅ FIX
        })
        setSections(updated)
    }

    const removePoint = (secIndex, subIndex, pointIndex) => {
        const updated = [...sections]
        const points = updated[secIndex].subItems[subIndex].section_sub_points
        if (points.length > 1) {
            points.splice(pointIndex, 1)
        }
        setSections(updated)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!editId) {
            return alert('Please select a blog first')
        }

        // -----------------------------
        // VALIDATION
        // -----------------------------
        for (let sec of sections) {
            if (!sec.section_title?.trim()) {
                return alert('Section title is required')
            }
        }

        try {
            setLoading(true)

            const formData = new FormData()

            // -----------------------------
            // BASIC DATA
            // -----------------------------
            formData.append("blog_id", editId)

            const sectionsData = sections.map((sec, index) => ({
                section_title: sec.section_title,
                section_short_description: sec.section_short_description,
                section_full_description: sec.section_full_description,
                subItems: sec.subItems,
                image_key: `section_image_${index}`
            }))

            formData.append("sections", JSON.stringify(sectionsData))

            // -----------------------------
            // FILES
            // -----------------------------
            sections.forEach((sec, index) => {
                if (sec.section_image && typeof sec.section_image !== "string") {
                    formData.append(`section_image_${index}`, sec.section_image)
                }
            })

            // -----------------------------
            // API CALL
            // -----------------------------
            const path = editId ? 'blog/update-section' : 'blog/add-section'

            const response = await post_api({
                body: formData,
                path
            })

            // -----------------------------
            // RESPONSE
            // -----------------------------
            if (response?.status === 200) {
                Swal.fire({
                    title: 'Success',
                    text: editId
                        ? 'Blog Section Updated Successfully!'
                        : 'Blog Section Added Successfully!',
                    icon: 'success'
                })
            } else {
                Swal.fire({
                    title: 'Error',
                    text: response?.msg || 'Something went wrong',
                    icon: 'error'
                })
            }

        } catch (error) {
            console.log(error)
            Swal.fire({
                title: 'Error',
                text: 'Server Error',
                icon: 'error'
            })
        } finally {
            setLoading(false)
        }
    }

    const fetchSections = async () => {
        try {
            setLoading(true)

            const res = await get_api({
                params: editId,
                path: `blog/sections`
            })

            if (res.status === 200) {

                // 🔥 IMPORTANT TRANSFORM
                const formatted = res.data.sections.map(sec => ({
                    section_title: sec.section_title,
                    section_short_description: sec.section_short_description,
                    section_full_description: sec.section_full_description,
                    section_image: sec.section_image, // already URL
                    subItems: sec.sub_content || [
                        {
                            section_sub_heading: '',
                            section_sub_points: ['']
                        }
                    ]
                }))

                setSections(formatted)
            }

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (editId) {
            fetchSections()
        }
    }, [editId])

    return (
        <div className="w-full bg-[#0D1D2D] min-h-screen p-8 text-white">
            {loading && <Loading />}
            <form onSubmit={handleSubmit} className="max-w-[1320] mx-auto bg-[#13293D] p-8 rounded-lg shadow-lg">

                <h2 className="text-2xl font-bold mb-3">{editId ? 'Update Blog Sections' : 'Add Blog Sections'}</h2>

                <p className='mb-3 text-red-500 font-bold '>Note - Please choose a Blog First to Add Or Update Sections</p>

                {sections.map((section, index) => (
                    <div key={index} className="mb-8 border border-gray-600 p-5 rounded-lg">

                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-semibold bg-[#00B0D3] text-white px-4 py-2 rounded">
                                Section {index + 1}
                            </h3>

                            <button
                                type="button"
                                disabled={sections.length === 1}
                                onClick={() => removeSection(index)}
                                className="bg-red-600 px-4 py-2 rounded text-sm disabled:opacity-50"
                            >- Remove Section</button>
                        </div>

                        {/* Section Fields */}
                        <input
                            type="text"
                            placeholder="Section Title"
                            value={section.section_title}
                            onChange={(e) =>
                                handleSectionChange(index, 'section_title', e.target.value)
                            }
                            className="w-full p-3 mb-3 bg-[#0D1D2D] border border-gray-600 rounded"
                        />

                        <input
                            type="text"
                            placeholder="Short Description"
                            value={section.section_short_description}
                            onChange={(e) =>
                                handleSectionChange(index, 'section_short_description', e.target.value)
                            }
                            className="w-full p-3 mb-3 bg-[#0D1D2D] border border-gray-600 rounded"
                        />

                        <textarea
                            placeholder="Full Description"
                            value={section.section_full_description}
                            onChange={(e) =>
                                handleSectionChange(index, 'section_full_description', e.target.value)
                            }
                            className="w-full p-3 mb-3 bg-[#0D1D2D] border border-gray-600 rounded"
                        />


                        {section.section_image && typeof section.section_image === "string" && (
                            <img
                                src={section.section_image}
                                className="w-24 h-16 object-cover rounded mb-2"
                            />
                        )}

                        <input
                            type="file"
                            onChange={(e) =>
                                handleSectionChange(index, 'section_image', e.target.files[0])
                            }
                            className="w-full p-3 mb-3 bg-[#0D1D2D] border border-gray-600 rounded cursor-pointer"
                        />



                        {/* Sub Items */}
                        <div className="bg-[#0D1D2D] p-4 rounded">
                            <p className="mb-2 font-semibold">Sub Sections</p>

                            {section.subItems.map((sub, subIndex) => (
                                <div key={subIndex} className="mb-3 border-b pb-3">

                                    <input
                                        type="text"
                                        placeholder="Sub Heading"
                                        value={sub.section_sub_heading}
                                        onChange={(e) =>
                                            handleSubChange(index, subIndex, 'section_sub_heading', e.target.value)
                                        }
                                        className="w-full p-2 mb-2 bg-[#13293D] border border-gray-600 rounded"
                                    />

                                    {sub.section_sub_points.map((point, pIndex) => (
                                        <div key={pIndex} className="flex gap-3 items-center mb-2">

                                            <input
                                                type="text"
                                                placeholder={`Point ${pIndex + 1}`}
                                                value={point}
                                                onChange={(e) =>
                                                    handlePointChange(index, subIndex, pIndex, e.target.value)
                                                }
                                                className="w-full p-2 bg-[#13293D] border border-gray-600 rounded"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removePoint(index, subIndex, pIndex)}
                                                className="bg-red-600 px-2 py-2.5 rounded text-sm cursor-pointer"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addPoint(index, subIndex)}
                                        className="bg-blue-500 px-3 py-1 rounded cursor-pointer text-sm mt-1"
                                    >
                                        + Add Point
                                    </button>

                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => addSubItem(index)}
                                className="mt-2 bg-green-500 px-4 py-2 rounded"
                            >
                                + Add Sub Item
                            </button>
                        </div>

                    </div>
                ))}

                {/* Add Section Button */}
                <button
                    type="button"
                    onClick={addSection}
                    className="bg-blue-500 px-5 py-3 rounded-lg mt-3"
                >
                    + Add Section
                </button>

                {/* Submit */}
                <button
                    type="submit"
                    className="block bg-[#00B0D3] px-6 py-3 rounded-lg mt-5"
                >
                    Save All Sections
                </button>

            </form>
        </div>
    )
}
