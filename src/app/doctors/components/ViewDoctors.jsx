'use client'
import { get_api, post_api } from '@/app/api_helper/api_helper'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { FaUserDoctor } from 'react-icons/fa6'
import { MdDelete } from 'react-icons/md'
import Swal from 'sweetalert2'
import Loading from '../../../../Loading'
import { RiRefreshLine } from 'react-icons/ri'

export default function ViewDoctors({ setActiveTab, setEditId }) {

    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchDoctors = async () => {
        setLoading(true)
        try {
            const result = await get_api({
                params: null,
                path: "doctor/view",
            });
            setDoctors(result?.data?.response || [])
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDoctors()
    }, [])


    const deleteDoctor = async (id) => {
        try {

            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            })

            if (!result.isConfirmed) return

            const response = await post_api({
                body: {},
                params: id,
                path: 'doctor/delete'
            })

            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    'Doctor Deleted Successfully.',
                    'success'
                )
                fetchDoctors()
            } else {
                Swal.fire(
                    'Something went wrong!',
                    'Failed to delete doctor!',
                    'error'
                )
            }

        } catch (error) {
            console.log(error)

            Swal.fire(
                'Something went wrong!',
                'Failed to delete doctor!',
                'error'
            )
        }
    }

    const editDoctor = (id) => {
        try {
            setActiveTab('add')
            setEditId(id)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            {loading && <Loading />}
            <div className="w-full bg-[#0D1D2D] min-h-screen p-8 text-white">
                <div className="max-w-[1320] mx-auto bg-[#13293D] p-8 rounded shadow-lg">

                    <div className="flex items-center justify-between text-white">
                        <h2 className="text-3xl  font-bold text-white mb-8">
                            All Doctors
                        </h2>
                        <span onClick={() => fetchDoctors()} className="flex items-center gap-1 cursor-pointer hover:text-cyan-500 duration-100"><RiRefreshLine /> Refresh </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">

                            <thead>
                                <tr className="bg-[#0D1D2D] text-gray-300">
                                    <th className="p-4">Image</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Specialization</th>
                                    <th className="p-4">Experience</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Featured</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {doctors?.length > 0 ? (
                                    doctors?.map((doc, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-700 hover:bg-[#1B3A57] transition"
                                        >
                                            <td className="p-4">
                                                {doc.profile_image ? (
                                                    <img
                                                        src={doc.profile_image}
                                                        alt={doc.name}
                                                        className="w-14 h-14 rounded-full object-cover border border-gray-600"
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
                                                        <FaUserDoctor />
                                                    </div>
                                                )}
                                            </td>

                                            <td className="p-4 font-semibold">{doc.name}</td>

                                            <td className="p-4 text-gray-300">
                                                {doc.primary_specialization}
                                            </td>

                                            <td className="p-4">
                                                {doc.experience_year} yrs
                                            </td>

                                            <td className="p-4">{doc.phone_number}</td>

                                            <td className="p-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${doc.is_active
                                                        ? "bg-green-600"
                                                        : "bg-red-600"
                                                        }`}
                                                >
                                                    {doc.is_active ? "Active" : "Inactive"}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${doc.is_featured
                                                        ? "bg-green-600"
                                                        : "bg-red-600"
                                                        }`}
                                                >
                                                    {doc.is_featured ? "Featured" : "Unfeatured"}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <div className="flex justify-center gap-3">
                                                    <button onClick={() => editDoctor(doc.id)} className="p-2 bg-yellow-500 rounded hover:bg-yellow-600 transition">
                                                        <FaEdit />
                                                    </button>
                                                    <button onClick={() => deleteDoctor(doc.id)} className="p-2 bg-red-600 rounded hover:bg-red-700 transition">
                                                        <MdDelete />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center text-3xl p-6 text-cyan-300 animate-pulse font-bold">
                                            No Doctors Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </>
    )

}