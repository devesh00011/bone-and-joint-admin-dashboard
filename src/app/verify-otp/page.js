'use client'
import React, { useRef, useState, useEffect } from 'react'
import { post_api } from '../api_helper/api_helper'
import { setAdminLogin } from '../redux/slices/adminAuthSlice'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

export default function VerifyOtp() {

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [timer, setTimer] = useState(60)
    const inputs = useRef([])

    const dispatch = useDispatch()

    const router = useRouter()

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [timer])

    const handleChange = (value, index) => {

        if (!/^[0-9]?$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            inputs.current[index + 1].focus()
        }

        const otpValue = newOtp.join("")

        if (otpValue.length === 6) {
            submitOtp(otpValue)
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus()
        }
    }

    const submitOtp = async (otpValue) => {

        try {

            const admin_id = localStorage.getItem("admin_id")

            const response = await post_api({
                path: "admin/verify-otp",
                body: {
                    admin_id,
                    otp: otpValue
                }
            })
            console.log(otpValue)
            console.log(response)

            // SUCCESS
            if (response.data.success == true) {

                dispatch(setAdminLogin(response.data.token))


                Swal.fire({
                    icon: "success",
                    title: "OTP Verified",
                    text: "Welcome Admin"
                })

                router.push("/dashboard")
            }

        } catch (error) {

            const status = error?.response?.status
            const msg = error?.response?.data?.msg

            if (status === 400) {
                Swal.fire({
                    icon: "warning",
                    title: "Bad Request",
                    text: msg
                })
            }

            else if (status === 401) {
                Swal.fire({
                    icon: "error",
                    title: "Invalid OTP",
                    text: msg
                })
            }

            else if (status === 404) {
                Swal.fire({
                    icon: "error",
                    title: "Admin Not Found",
                    text: msg
                })
            }

            else if (status === 410) {
                Swal.fire({
                    icon: "warning",
                    title: "OTP Expired",
                    text: msg
                })
            }

            else {
                Swal.fire({
                    icon: "error",
                    title: "Server Error",
                    text: "Something went wrong"
                })
            }

            console.log(error)
        }
    }

    const resendOtp = async () => {

        const admin_id = localStorage.getItem("admin_id")
        setTimer(60)
        try {

            const response = await post_api({
                path: "admin/resend-otp",
                body: { admin_id }
            })

            if (response.data.success) {

                setTimer(60)

                Swal.fire({
                    icon: "success",
                    title: "OTP Sent Again"
                })

            }

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Server Error"
            })

        }
    }

    return (
        <div className='min-h-[81.9vh] flex items-center justify-center bg-gray-900'>

            <div className='bg-[#13283B]/80 backdrop-blur-md border border-cyan-500/20 p-10 rounded-xl shadow-2xl text-center w-[380]'>

                {/* Heading */}
                <h2 className='text-3xl font-bold mb-2 bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'>
                    Verify OTP
                </h2>

                <p className='text-gray-400 text-sm mb-6'>
                    Enter the 6 digit verification code sent to your email.
                </p>

                {/* OTP Inputs */}
                <form className='flex gap-3 justify-center mb-6'>

                    {otp.map((digit, index) => (

                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={digit}
                            ref={(el) => (inputs.current[index] = el)}
                            onChange={(e) =>
                                handleChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className='w-18 h-18 text-center font-bold 
                            bg-[#0D1D2D] border border-cyan-400/40 
                            text-white rounded-md 
                            focus:outline-none focus:border-[#00B0D3]
                            focus:shadow-lg focus:shadow-cyan-500/30
                            transition duration-300 text-3xl'
                        />

                    ))}

                </form>

                {/* Timer / Resend */}
                <div className='text-sm text-gray-400'>

                    {timer > 0 ? (
                        <p>
                            Resend OTP in{" "}
                            <span className='text-cyan-400 font-semibold'>
                                {timer}s
                            </span>
                        </p>
                    ) : (
                        <button
                            onClick={resendOtp}
                            className='text-cyan-400 cursor-pointer hover:text-cyan-300 font-medium transition'
                        >
                            Resend OTP
                        </button>
                    )}

                </div>

            </div>

        </div>
    )
}