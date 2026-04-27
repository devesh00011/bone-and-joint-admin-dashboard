'use client'
import React, { useEffect, useState } from 'react'
import Loading from '../../../Loading'
import { RiRefreshLine } from 'react-icons/ri'
import { get_api } from '../api_helper/api_helper'

export default function Enquiries() {

    const [loading, setLoading] = useState(false)
    const [enquiries, setEnquiries] = useState([])

    const fetchEnquiries = async () => {
        try {
            setLoading(true)
            const response = await get_api({
                params: null,
                path: 'contact/view'
            })
            if (response.data.success) {
                setEnquiries(response.data.contactsQueries)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEnquiries()
    }, [])

    return (
        <div className="min-h-screen bg-[#0B1E2D] py-12 px-6">
            {loading && <Loading />}

            <div className="bg-[#132C3F] max-w-330 mx-auto rounded shadow-2xl border border-[#1f425d] p-8">

                <div className="flex items-center justify-between text-white">
                    <h2 className="text-3xl  font-bold text-white mb-8">
                        All Enquiries
                    </h2>
                    <span onClick={() => fetchEnquiries()} className="flex items-center gap-1 cursor-pointer hover:text-cyan-500 duration-100"><RiRefreshLine /> Refresh </span>
                </div>

                <table className="w-full table-auto text-sm">
                    <thead>
                        <tr className="text-white border-b border-[#214761]">
                            <th className="py-4 px-5 text-left">Sr.No.</th>
                            <th className="py-4 px-5 text-left">Name</th>
                            <th className="py-4 px-5 text-left">Email</th>
                            <th className="py-4 px-5 text-left">Phone Number</th>
                            <th className="py-4 px-5 text-center min-w-[120]">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enquiries.length == 0 ?
                            <tr
                                className="border-b border-[#1f425d] transition duration-200"
                            >
                                <td colSpan={9} className="py-10 text-cyan-200 animate-pulse px-4 text-3xl text-center font-bold">
                                    No Emquires Yet
                                </td>
                            </tr>
                            :
                            enquiries.map((item, index) => {
                                return (
                                    <tr className="border-b border-[#1f425d] hover:bg-[#003e4b] transition duration-200"
                                    >
                                        <td className="py-5 px-5 capitalize text-white">
                                            {index + 1}
                                        </td>
                                        <td className="py-5 px-5 capitalize text-white">
                                            {item.full_name}
                                        </td>
                                        <td className="py-5 px-5 capitalize text-white">
                                            {item.email_id}
                                        </td>
                                        <td className="py-5 px-5 capitalize text-white">
                                            {item.phone_number}
                                        </td>
                                        <td className="py-5 px-5 text-center capitalize text-white">
                                            {item.user_message}
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
