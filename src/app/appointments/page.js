import React from "react";
import { Calendar, Clock, User, Stethoscope, Phone, Mail, CreditCard } from "lucide-react";

export default function Appointments() {
    const appointments = [
        {
            id: 1,
            patient: "Priya Verma",
            phone: "9876543210",
            email: "priya@email.com",
            doctor: "Dr. Amit Singh",
            date: "22 Feb 2026",
            time: "01:00 PM",
            status: "Pending",
            paymentMethod: "UPI",
            paymentProof: "https://via.placeholder.com/60",
        },
        {
            id: 2,
            patient: "Amit Joshi",
            phone: "9123456780",
            email: "amit@email.com",
            doctor: "Dr. Neha Kapoor",
            date: "25 Feb 2026",
            time: "04:15 PM",
            status: "Completed",
            paymentMethod: "Card",
            paymentProof: "https://via.placeholder.com/60",
        },
    ];

    const statusStyle = (status) => {
        if (status === "Pending")
            return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40";
        return "bg-blue-500/20 text-blue-400 border border-blue-500/40";
    };

    return (
        <div className="min-h-screen bg-[#0B1E2D] py-12 px-6">
            <div className="max-w-[1320] mx-auto">
                <div className="bg-[#132C3F] rounded shadow-2xl border border-[#1f425d] p-8">

                    <h2 className="text-3xl font-bold text-white mb-8">
                        All Appointments
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-sm">

                            {/* Header */}
                            <thead>
                                <tr className="text-gray-300 border-b border-[#214761]">
                                    <th className="py-4 px-6 text-left">Patient</th>
                                    <th className="py-4 px-6 text-left">Contact</th>
                                    <th className="py-4 px-6 text-left">Doctor</th>
                                    <th className="py-4 px-6 text-left">Date</th>
                                    <th className="py-4 px-6 text-left">Time</th>
                                    <th className="py-4 px-6 text-left">Payment</th>
                                    <th className="py-4 px-6 text-left">Proof</th>
                                    <th className="py-4 px-6 text-left">Status</th>
                                </tr>
                            </thead>

                            {/* Body */}
                            <tbody>
                                {appointments.map((appt) => (
                                    <tr
                                        key={appt.id}
                                        className="border-b border-[#1f425d] hover:bg-[#102738] transition"
                                    >
                                        {/* Patient */}
                                        <td className="py-4 px-6 text-white">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-teal-400" />
                                                {appt.patient}
                                            </div>
                                        </td>

                                        {/* Contact */}
                                        <td className="py-4 px-6 text-gray-300 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-teal-400" />
                                                {appt.phone}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-teal-400" />
                                                {appt.email}
                                            </div>
                                        </td>

                                        {/* Doctor */}
                                        <td className="py-4 px-6 text-white">
                                            <div className="flex items-center gap-2">
                                                <Stethoscope size={16} className="text-teal-400" />
                                                {appt.doctor}
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="py-4 px-6 text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-teal-400" />
                                                {appt.date}
                                            </div>
                                        </td>

                                        {/* Time */}
                                        <td className="py-4 px-6 text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-teal-400" />
                                                {appt.time}
                                            </div>
                                        </td>

                                        {/* Payment Method */}
                                        <td className="py-4 px-6 text-gray-300">
                                            <div className="flex items-center gap-2">
                                                <CreditCard size={16} className="text-teal-400" />
                                                {appt.paymentMethod}
                                            </div>
                                        </td>

                                        {/* Payment Proof Image */}
                                        <td className="py-4 px-6">
                                            <img
                                                src={appt.paymentProof}
                                                alt="Payment Proof"
                                                className="w-14 h-14 rounded object-cover border border-[#214761]"
                                            />
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-6">
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyle(
                                                    appt.status
                                                )}`}
                                            >
                                                {appt.status}
                                            </span>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}