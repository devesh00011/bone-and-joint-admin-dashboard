'use client'
import React, { useEffect, useState } from 'react'
import { get_api, post_api } from '../api_helper/api_helper'
import Swal from 'sweetalert2'
import Loading from '../../../Loading'

export default function Page() {

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        pc_image: null,
        mobile_image: null,
        description: "",
        points: ["", "", "", ""]
    })

    const handleChange = (e) => {
        const { name, value, files } = e.target

        if (name === "pc_image") {
            setFormData({ ...formData, pc_image: files[0] })
            setPreviewPcImage(URL.createObjectURL(files[0]))

        }
        else if (name === "mobile_image") {
            setFormData({ ...formData, mobile_image: files[0] })
            setPreviewMobileImage(URL.createObjectURL(files[0]))

        }
        else {
            setFormData({ ...formData, [name]: value })
        }
    }

    const handlePointChange = (index, value) => {
        const updatedPoints = [...formData.points]
        updatedPoints[index] = value
        setFormData({ ...formData, points: updatedPoints })
    }

    const [previewPcImage, setPreviewPcImage] = useState('/preview.png')

    const [previewMobileImage, setPreviewMobileImage] = useState('/preview.png')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setLoading(true)
            const form = new FormData()

            form.append("pc_image", formData.pc_image)
            form.append("mobile_image", formData.mobile_image)
            form.append("description", formData.description)
            form.append("points", JSON.stringify(formData.points))

            const response = await post_api({
                body: form,
                params: null,
                path: 'about-us/add'
            })

            if (response.status == 200) {
                Swal.fire({
                    text: 'Content Updated Successfully !',
                    title: 'Success',
                    icon: 'success'
                })
            }
        } catch (error) {
            Swal.fire({
                text: 'Something went wrong !',
                title: 'Try Again Later',
                icon: 'error'
            })
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    const fetchAboutUsContent = async () => {
        try {
            const response = await get_api({
                params: null,
                path: 'about-us/view'
            })

            const ab = response.data.data

            if (response.status === 200 && ab) {

                setFormData({
                    pc_image: null,
                    mobile_image: null,
                    description: ab.description || "",
                    points: ab.points?.length ? ab.points : ["", "", "", ""]
                })

                // ✅ Set preview images (IMPORTANT)
                setPreviewPcImage(ab.pc_image || '/preview.png')
                setPreviewMobileImage(ab.mobile_image || '/preview.png')
            }

        } catch (error) {
            console.log(error.message || 'Server Error')
        }
    }

    useEffect(() => {
        fetchAboutUsContent()
    }, [])

    return (
        <div className="min-h-screen bg-[#0B1E2D] py-12 px-6">
            {loading && <Loading />}

            <div className='max-w-[1320] mx-auto bg-[#13293D] p-8 rounded shadow-lg'>
                <h1 className='text-4xl  font-bold mb-4 text-white'>About Us Content</h1>


                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* PC Image */}
                    <div>
                        <p className="text-white mb-2 text-2xl font-bold">PC Image</p>
                        <img src={previewPcImage} className='w-[500] h-[300] object-contain border border-white p-5 mb-3' />

                        <input
                            type='file'
                            name='pc_image'
                            onChange={handleChange}
                            className='border border-white text-white w-full rounded py-2.5 px-4 cursor-pointer'
                        />
                    </div>

                    {/* Mobile Image */}
                    <div>
                        <p className="text-white mb-2 text-2xl font-bold">Mobile Image</p>
                        <img src={previewMobileImage} className='w-[280] h-[280] object-cover border border-white p-5 mb-3' />
                        <input
                            type='file'
                            name='mobile_image'
                            onChange={handleChange}
                            className='border border-white text-white w-full rounded py-2.5 px-4 cursor-pointer'
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-white mb-2">About Description</p>
                        <textarea
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            className='w-full rounded p-3 border border-white text-white bg-transparent'
                            placeholder='Write about hospital...'
                        />
                    </div>

                    {/* Points */}
                    <div>
                        <p className="text-white mb-2">Key Points</p>

                        {formData.points.map((point, index) => (
                            <input
                                key={index}
                                type="text"
                                value={point}
                                onChange={(e) => handlePointChange(index, e.target.value)}
                                placeholder={`Point ${index + 1}`}
                                className='w-full mb-3 border border-white text-white rounded py-2 px-3 bg-transparent'
                            />
                        ))}
                    </div>

                    {/* Submit */}
                    <button
                        disabled={loading}
                        className="w-[200] hover:w-[300] transition-all text-lg bg-[#00B0D3] py-3 rounded-md font-semibold text-white hover:bg-cyan-800 cursor-pointer duration-300"
                        type='submit'
                    >
                        Submit
                    </button>

                </form>

            </div>
        </div>
    )
}