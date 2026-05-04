'use client'
import { get_api, post_api } from '@/app/api_helper/api_helper'
import React, { useEffect, useState } from 'react'
import { FaUserDoctor } from 'react-icons/fa6'
import Swal from 'sweetalert2'

export default function AddServicesVideos({ editId, setEditId }) {

    // alert(editId)

    const [serviceData, setServiceData] = useState([])
    const [loading, setLoading] = useState(false)

    const [videoLink, setVideoLink] = useState('')
    const [testimonials, setTestimonials] = useState([''])

    const [checkDataexist, setCheckDataExists] = useState(false)

    const fetchAllServices = async () => {
        try {
            setLoading(true)
            const response = await get_api({
                params: null,
                path: 'service/view'
            })
            if (response.status == 200) {
                setServiceData(response.data.response)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllServices()
    }, [])

    const addTestimonialField = () => {
        setTestimonials([...testimonials, ''])
    }

    const handleTestimonialChange = (value, index) => {
        const updated = [...testimonials]
        updated[index] = value
        setTestimonials(updated)
    }

    const saveForm = async (e) => {
        e.preventDefault();

        if (!editId) {
            Swal.fire('Select Service', '', 'warning');
            return;
        }

        try {
            setLoading(true);

            const payload = {
                service_id: editId,
                service_video: videoLink,
                service_testimonials: testimonials.filter(t => t.trim() !== '')
            };


            let response;

            if (checkDataexist) {
                response = await post_api({
                    body: payload,
                    path: 'service/update-videos'
                });
            } else {
                response = await post_api({
                    body: payload,
                    path: 'service/upload-videos'
                });
            }

            if (response.status == 200) {
                Swal.fire({
                    title: 'Success',
                    text: checkDataexist ? 'Updated Successfully' : 'Created Successfully',
                    icon: 'success'
                });

                setVideoLink('');
                setTestimonials(['']);
                setEditId(null)
            }

        } catch (error) {
            console.log(error);
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong',
                icon: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchDataById = async () => {
        try {
            setLoading(true)
            const response = await get_api({
                params: editId,
                path: 'service/view-service-videos'
            });

            if (response.status === 200) {
                const data = response.data.data;

                setVideoLink(data.service_video || '');

                setTestimonials(
                    data.service_testimonials?.length > 0
                        ? data.service_testimonials
                        : ['']
                );

                setCheckDataExists(true);
            }

        } catch (error) {
            setVideoLink('');
            setTestimonials(['']);
            setCheckDataExists(false);

            console.log(error.message);
        }
        finally {
            setLoading(false)
        }
    };

    console.log('check data', checkDataexist)

    useEffect(() => {
        if (editId) {
            fetchDataById()
        }
    }, [editId])


    return (
        <div className="w-full bg-[#0D1D2D] min-h-screen p-8">
            <div className="max-w-[1320] mx-auto bg-white p-8 rounded shadow-lg">

                <h2 className="text-3xl flex items-center gap-2.5 font-bold text-gray-800 mb-6">
                    <FaUserDoctor /> Update Service Videos
                </h2>

                <form onSubmit={saveForm}>

                    {/* SERVICE SELECT */}
                    <select
                        value={editId || ""}
                        onChange={(e) => setEditId(e.target.value)}
                        className='border w-full py-3 rounded-md px-4 mb-4'
                    >
                        <option value="">Select Service</option>

                        {loading ? (
                            <option value="">Loading...</option>
                        ) : serviceData.length > 0 ? (
                            serviceData.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.service_name}
                                </option>
                            ))
                        ) : (
                            <option>No Service Found</option>
                        )}
                    </select>

                    {/* VIDEO LINK */}
                    <div className='my-3'>
                        <label>Paste Video Link Here</label>
                        <input
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            placeholder='https://youtube.com'
                            type="text"
                            className='w-full py-3 px-4 border rounded-md'
                        />
                    </div>

                    {/* TESTIMONIALS */}
                    <div>
                        <label>Testimonials Links</label>

                        {testimonials.map((item, index) => (
                            <input
                                key={index}
                                value={item}
                                onChange={(e) => handleTestimonialChange(e.target.value, index)}
                                placeholder={`https://youtube.com/testimonial-${index + 1}`}
                                type="text"
                                className='w-full my-2 py-3 px-4 border rounded-md'
                            />
                        ))}

                        <p
                            onClick={addTestimonialField}
                            className='py-1 my-4 text-white bg-green-700 cursor-pointer rounded w-fit px-4'
                        >
                            + Add More
                        </p>
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        className="w-[200] hover:w-[300] rounded-r-full text-white bg-[#00B0D3] py-3 cursor-pointer font-semibold hover:bg-cyan-800 duration-300"
                    >
                        Save Videos
                    </button>

                </form>
            </div>
        </div>
    )
}