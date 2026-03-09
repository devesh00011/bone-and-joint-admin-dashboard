'use client'
import React, { useEffect, useState } from "react";
import { Calendar, Clock, User, Stethoscope, Phone, Mail, CreditCard } from "lucide-react";
import Loading from "../../../Loading";
import { get_api, post_api } from "../api_helper/api_helper";
import { FaDeleteLeft } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2";
import { RiRefreshLine } from "react-icons/ri";

export default function Appointments() {

    const [loading, setLoading] = useState(false)
    const [appointment, setAppointment] = useState([])

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            const response = await get_api({
                params: null,
                path: 'appointment/view'
            })
            if (response.data.success) {
                setAppointment(response.data.appointments)
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAppointments()
    }, [])


    const deleteAppointment = async (id) => {
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
                path: 'appointment/delete'
            })

            if (response.data.success) {
                Swal.fire(
                    'Deleted!',
                    'Appointment Deleted Successfully.',
                    'success'
                )
                fetchAppointments()
            } else {
                Swal.fire(
                    'Something went wrong!',
                    'Failed to delete Appointment!',
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

    return (
        <div className="min-h-screen bg-[#0B1E2D] py-12 px-6">
            {loading && <Loading />}
            <div className="w-full">
                <div className="bg-[#132C3F] rounded shadow-2xl border border-[#1f425d] p-8">

                    <div className="flex items-center justify-between text-white">
                        <h2 className="text-3xl  font-bold text-white mb-8">
                            All Appointments
                        </h2>
                        <span onClick={() => fetchAppointments()} className="flex items-center gap-1 cursor-pointer hover:text-cyan-500 duration-100"><RiRefreshLine /> Refresh </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-sm">
                            <thead>
                                <tr className="text-white border-b border-[#214761]">
                                    <th className="py-4 px-4 text-left">Patient Name</th>
                                    <th className="py-4 px-4 text-left">Contact</th>
                                    <th className="py-4 px-4 text-center">Doctor Image</th>
                                    <th className="py-4 px-4 text-left">Doctor Name</th>
                                    <th className="py-4 px-4 text-left min-w-[120]">Apt Date</th>
                                    <th className="py-4 px-4 text-left min-w-[100]">Apt Time</th>
                                    <th className="py-4 px-4 text-left">Payment</th>
                                    <th className="py-4 px-4 text-center">Proof</th>
                                    <th className="py-4 px-4 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    appointment.length == 0
                                        ?
                                        <tr
                                            className="border-b border-[#1f425d] transition duration-200"
                                        >
                                            <td colSpan={9} className="py-10 text-cyan-200 animate-pulse px-4 text-3xl text-center font-bold">
                                                No Appointments Yet
                                            </td>
                                        </tr>
                                        :

                                        appointment.map((item, index) => (
                                            <tr
                                                key={index}
                                                className="border-b border-[#1f425d] hover:bg-[#102738] transition duration-200"
                                            >
                                                {/* Patient */}
                                                <td className="py-5 px-4 capitalize text-white">
                                                    <div className="flex items-center gap-2">
                                                        <User size={16} className="text-teal-400" />
                                                        {item.patient_name}
                                                    </div>
                                                </td>

                                                {/* Contact */}
                                                <td className="py-5 px-4 text-white space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={14} className="text-teal-400" />
                                                        {item.patient_phone}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={14} className="text-teal-400" />
                                                        {item.patient_email}
                                                    </div>
                                                </td>

                                                {/* Doctor Image */}
                                                <td className="py-5 px-4 text-center">
                                                    <img
                                                        src={item.profile_image}
                                                        className="w-14 h-14 rounded-md object-cover border border-[#214761] mx-auto"
                                                    />
                                                </td>

                                                {/* Doctor Name */}
                                                <td className="py-5 px-4 text-white">
                                                    <div className="flex items-center gap-2">
                                                        <User size={16} className="text-teal-400" />
                                                        {item.name}
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="py-5 px-4 text-white">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} className="text-teal-400" />
                                                        {item.date_only}
                                                    </div>
                                                </td>

                                                {/* Time */}
                                                <td className="py-5 px-4 text-white">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={16} className="text-teal-400" />
                                                        {item.time_only}
                                                    </div>
                                                </td>

                                                {/* Payment */}
                                                <td className="py-5 px-4 text-green-400 font-semibold uppercase">
                                                    {item.payment_method}
                                                </td>

                                                {/* Proof */}
                                                <td className="py-5 px-4 text-center">
                                                    {item.payment_proof_image ? (
                                                        <img
                                                            src={item.payment_proof_image}
                                                            className="w-14 h-14 rounded object-cover border border-[#214761] mx-auto"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">
                                                            Not Added
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Action */}
                                                <td className="py-5 px-4 text-center">
                                                    <button onClick={() => deleteAppointment(item.id)} className="text-xl cursor-pointer text-white hover:text-red-500 duration-200">
                                                        <MdDelete />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))


                                }
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}