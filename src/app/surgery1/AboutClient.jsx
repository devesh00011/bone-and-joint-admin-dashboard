"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import BookAppointMentModel from '../common/BookAppointMentModel'
import { MobileNumber, TelePhoneNumber } from '../WebSensitives/ContactSensitives'
import { get_api } from '../api_helper/api_helper'


export default function AboutClient() {
    const [appointmentModel, setAppointmentModel] = useState(false)

    const Doctors = useSelector((store) => store.doctor)

    const services = useSelector((store) => store.service)

    const [aboutUsData, setAboutUsData] = useState(null)

    const fetchAboutUsContent = async () => {
        try {
            const response = await get_api({
                params: null,
                path: 'about-us/view'
            })

            if (response.status === 200) {
                setAboutUsData(response.data.data)
            } else {
                setAboutUsData(null)
            }

        } catch (error) {
            console.log(error.message || 'Api Error')
        }
    }

    useEffect(() => {
        fetchAboutUsContent()
    }, [])

    // ✅ Safe fallback values
    const description = aboutUsData?.description || "Loading content..."
    const pc_image = aboutUsData?.pc_image || "/aboutus.jpeg"
    const mobile_image = aboutUsData?.mobile_image || "/aboutus.jpeg"

    const points = aboutUsData?.points?.length
        ? aboutUsData.points
        : [
            'Experienced orthopaedic care',
            'Advanced surgical procedures',
            'Patient-centric treatment',
            '24/7 emergency care'
        ]

    console.log(aboutUsData)

    return (
        <>

            <BookAppointMentModel
                appointmentModel={appointmentModel}
                setAppointmentModel={setAppointmentModel}
            />
            {appointmentModel
                &&
                <div onClick={() => setAppointmentModel(false)} className='fixed top-0 left-0 bg-black/90 z-50 w-full h-screen'></div>
            }
            <section className="w-full bg-white">

                {/* ================= HERO SECTION ================= */}

                {/* PC IMAGE */}
                <div className="hidden md:block relative w-full h-[80vh] overflow-hidden shadow-lg rounded">
                    <Image
                        src={pc_image}
                        alt="About Hospital"
                        fill
                        className="object-cover object-center"
                    />
                </div>

                {/* MOBILE IMAGE */}
                <div className='p-5'>
                    <div className="block md:hidden relative w-full sm:h-[150vh] h-[90vh] overflow-hidden shadow-lg rounded">
                        <Image
                            src={mobile_image}
                            alt="About Hospital"
                            fill
                            className="object-cover object-center"
                        />
                    </div>
                </div>

            </section>

            <div className="lg:py-24 py-12 bg-linear-to-b from-white to-[#f0f9ff] border-b-6 border-cyan-600">
                <div className="max-w-[1320] mx-auto lg:px-0 px-4 w-full">

                    {/* Title */}
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                        About <span className="text-[#00B4D8]">Us</span>
                    </h2>

                    <div className="w-24 h-[4] bg-[#00B4D8] mt-4 rounded-full"></div>

                    {/* Content Box */}
                    <div className="mt-8 bg-white shadow-md rounded-2xl p-6 md:p-10 border border-gray-100">

                        <p className="text-gray-700 whitespace-pre-line leading-relaxed text-justify text-[15px] md:text-base">
                            {description}
                        </p>

                    </div>

                    {/* Buttons */}
                    <div className='flex flex-col sm:flex-row gap-4 mt-8'>

                        <button
                            onClick={() => setAppointmentModel(true)}
                            className='bg-[#00B4D8] text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300'
                        >
                            Book Appointment
                        </button>

                        <Link href={`tel:${MobileNumber}`}>
                            <button className='border-2 border-[#00B4D8] text-[#00B4D8] px-8 py-4 rounded-full font-semibold hover:bg-[#00B4D8] hover:text-white transition-all duration-300'>
                                Contact Us
                            </button>
                        </Link>

                    </div>

                </div>
            </div>

            <section className="w-full bg-white"> <div className="max-w-[1320] mx-auto px-6 lg:py-20 py-10">

                <h3 className="lg:text-5xl text-4xl  font-bold text-gray-800 text-center lg:mb-14 mb-5">
                    Our Treatments
                </h3>

                <div className="grid md:grid-cols-3 grid-cols-1 gap-10">

                    {services.map((service, index) => (

                        <Link key={index} href={`/treatments/${service.service_slug}`}>
                            <div className=' shadow-xl group overflow-hidden rounded-xl'>

                                <img src={service.service_image} className='rounded-t-xl group-hover:scale-105 duration-500 cursor-pointer' />

                                <div
                                    key={index}
                                    className="bg-[#0B1C2D] cursor-pointer shadow-lg text-white p-6 rounded-b-xl group-hover:bg-[#007288] transition"
                                >
                                    {service.service_name}

                                    <p className='text-gray-400 group-hover:text-white'>{service.short_description}</p>

                                </div>

                            </div>
                        </Link>
                    ))}

                </div>
            </div>
            </section>


            <section className='w-full bg-[#f0f9ff] border-y-6 border-cyan-700'>
                <div className="max-w-[1320] mx-auto px-6 lg:py-24 py-12">

                    <h3 className="lg:text-5xl text-4xl font-extrabold text-gray-800 text-center mb-4">
                        Our Experience
                    </h3>

                    <p className="text-center text-gray-500 mb-14 max-w-2xl mx-auto">
                        Delivering excellence in orthopaedic care with years of trust, precision, and patient satisfaction.
                    </p>

                    <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">

                        {[
                            { number: "20+", label: "Years of Experience", icon: "⏳" },
                            { number: "80k+", label: "Happy Patients", icon: "😊" },
                            { number: "98%", label: "Success Rate", icon: "📈" },
                            { number: "24/7", label: "Emergency Services", icon: "🚑" }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                            >
                                {/* Glow effect */}
                                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#00B4D8]/20 to-cyan-300/10 opacity-0 group-hover:opacity-100 transition duration-300"></div>

                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center">

                                    <div className="text-3xl mb-3 group-hover:scale-110 transition">
                                        {item.icon}
                                    </div>

                                    <h4 className="text-4xl font-extrabold text-[#00B4D8] group-hover:text-cyan-600 transition">
                                        {item.number}
                                    </h4>

                                    <p className="mt-3 text-gray-600 font-medium text-sm">
                                        {item.label}
                                    </p>

                                    {/* Animated underline */}
                                    <div className="w-0 group-hover:w-12 h-[2] bg-[#00B4D8] mt-3 transition-all duration-300"></div>

                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </section>





            <section className='w-full bg-gray-100'>
                <div className=" lg:py-20 py-10">
                    <div className="max-w-[1320] mx-auto px-6">

                        <h3 className="lg:text-5xl text-4xl font-bold text-gray-800 text-center mb-14">
                            Our Expert Doctors
                        </h3>

                        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">

                            {Doctors?.map((item, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-xl p-6">
                                    <div className="relative w-full h-[320] cursor-pointer overflow-hidden mb-4">
                                        <Image
                                            src={item.profile_image}
                                            alt="Doctor"
                                            fill
                                            className="object-cotain hover:scale-[1.1] duration-300"
                                        />
                                    </div>

                                    <h4 className="text-xl font-bold text-gray-800">
                                        {item.name}
                                    </h4>
                                    <p className="text-[#00B4D8] mt-2 text-lg">
                                        {item.primary_specialization}
                                    </p>

                                    <Link href={`/doctors/${item.slug}`}>
                                        <p className='w-full py-2 text-center bg-[#00B4D8] hover:bg-cyan-900 duration-200 text-white rounded-lg my-2'>View Details</p>
                                    </Link>
                                </div>
                            ))}

                        </div>

                        <div className='flex justify-center'>
                            <div className="text-center mt-10">
                                <Link
                                    href="/doctors"
                                    className="bg-[#0B1C2D] px-20 text-white w-[500] py-3 rounded-full hover:bg-[#00B4D8] transition"
                                >
                                    View All Doctors
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>





            <section className="bg-linear-to-r from-[#274a6d] to-gray-950 border-t-8 border-cyan-400 py-16 text-center">
                <div className="max-w-[900] mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6 text-white">
                        Ready to Book Your Appointment?
                    </h2>

                    <p className="text-white mb-8">
                        Experience expert medical care with compassion and precision.
                    </p>

                    <button onClick={() => setAppointmentModel(true)} className="bg-white text-[#0B1C2D] px-10 py-4 rounded-full font-semibold hover:bg-gray-200 cursor-pointer transition shadow-xl">
                        Schedule Appointment
                    </button>
                </div>
            </section>
        </>

    )
}
