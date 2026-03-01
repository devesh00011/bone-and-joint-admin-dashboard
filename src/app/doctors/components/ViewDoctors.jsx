'use client'
import { get_api, post_api } from '@/app/api_helper/api_helper'
import axios from 'axios'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa'
import { FaUserDoctor } from 'react-icons/fa6'
import { MdDelete } from 'react-icons/md'

export default function ViewDoctors({ setActiveTab, setEditId }) {

    const [doctors, setDoctors] = useState([])


    const fetchDoctors = async () => {
        try {
            const result = await get_api({
                params: null,
                path: "doctor/view",
            });
            setDoctors(result?.response || [])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchDoctors()
    }, [])

    useEffect(() => {
        fetchDoctors()
    }, [doctors])

    const deleteDoctor = (id) => {
        try {
            const res = post_api({
                body: {},
                params: id,
                path: 'doctor/delete'
            })
            console.log(res)
        } catch (error) {
            console.log(error)
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
        <div className="w-full bg-[#0D1D2D] min-h-screen p-8 text-white">
            <div className="max-w-[1320] mx-auto bg-[#13293D] p-8 rounded shadow-lg">

                <h2 className="text-3xl flex items-center gap-3 font-bold mb-6">
                    View Doctors
                </h2>

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
                            {doctors.length > 0 ? (
                                doctors.map((doc, index) => (
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
                                    <td colSpan="7" className="text-center p-6 text-gray-400">
                                        No Doctors Found
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    )

}