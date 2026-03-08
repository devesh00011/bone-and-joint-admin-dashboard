'use client'
import React, { useState } from 'react'
import Loading from '../../../Loading'
import Swal from 'sweetalert2'
import { post_api } from '../api_helper/api_helper'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ForgotPassword() {
    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [adminEmail, setAdminEmail] = useState('')
    const [otpValue, setOtpValue] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const [emailVerified, setEmailVerified] = useState(false)
    const [otpVerified, setOtpVerified] = useState(false)


    const sendOtp = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {

            const response = await post_api({
                body: { admin_email: adminEmail },
                params: null,
                path: 'admin/send-otp-to-forgot'
            })

            if (response.data.success) {
                setEmailVerified(true)

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.msg,
                    confirmButtonColor: '#00B0D3'
                })

            }

        } catch (error) {
            if (error.response) {

                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: error.response.data.msg || 'You Entered a wrong Email !',
                    confirmButtonColor: '#00B0D3'
                })

            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Server Error',
                    text: 'Please try again later',
                    confirmButtonColor: '#00B0D3'
                })

            }

        } finally {
            setLoading(false)
        }
    }

    const verifyOtpValue = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {

            const response = await post_api({
                body: { admin_email: adminEmail, otp: otpValue },
                params: null,
                path: 'admin/verify-otp-by-email'
            })

            if (response.data.success) {
                setOtpVerified(true)

                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.msg,
                    confirmButtonColor: '#00B0D3'
                })
            }
        }
        catch (error) {
            if (error.response) {

                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: error.response.data.msg || 'Invalid Otp !',
                    confirmButtonColor: '#00B0D3'
                })

            } else {

                Swal.fire({
                    icon: 'error',
                    title: 'Server Error',
                    text: 'Please try again later',
                    confirmButtonColor: '#00B0D3'
                })

            }

        } finally {
            setLoading(false)
        }
    }



    const createNewPassword = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await post_api({
                body: {
                    new_password: e.target.new_password.value,
                    admin_email: adminEmail
                },
                params: null,
                path: 'admin/create-new-password'
            })

            // 200 OK
            if (response.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: response.data.msg,
                    confirmButtonColor: '#00B0D3'
                }).then((res) => {
                    if (res.isConfirmed) {
                        router.push('/')
                    }
                })
            }

        } catch (error) {
            if (error.response) {
                // 404: Cannot change password
                if (error.response.status === 404) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Failed',
                        text: error.response.data.msg,
                        confirmButtonColor: '#00B0D3'
                    })
                }
                // 500: Server Error
                else if (error.response.status === 500) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Server Error',
                        text: error.response.data.msg || 'Something went wrong',
                        confirmButtonColor: '#00B0D3'
                    })
                }
            } else {
                // Network or other errors
                Swal.fire({
                    icon: 'error',
                    title: 'Network Error',
                    text: 'Please check your connection',
                    confirmButtonColor: '#00B0D3'
                })
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {loading && <Loading />}
            <div className="min-h-[81vh] flex items-center justify-center bg-[#0D1D2D] px-4">

                <div className="w-full  max-w-lg bg-[#132C44] border border-cyan-900 rounded-xl p-8 shadow-xl">

                    {/* Title */}
                    <h2 className="text-3xl font-bold text-[#00B0D3] text-center mb-2">
                        Forgot Password
                    </h2>

                    <p className="text-gray-400 text-center mb-8">
                        Enter your email and verify OTP to reset password
                    </p>

                    {/* Email Field */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-300 block mb-2">
                            Admin Email

                        </label>

                        <form onSubmit={sendOtp} className="flex gap-3">
                            <input
                                type="email"
                                onChange={(e) => setAdminEmail(e.target.value)}
                                name='admin_email'
                                placeholder="Enter your email"
                                className="flex-1 bg-[#0D1D2D] border border-cyan-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00B0D3]"
                            />
                            <div className='flex items-center '>

                                {emailVerified ? (
                                    <CheckCircle size={28} className="text-[#00B0D3]" />
                                )
                                    :
                                    <button className="bg-[#00B0D3] cursor-pointer hover:bg-[#0092b0] px-4 py-2.5 rounded-lg font-semibold transition">
                                        Send OTP
                                    </button>
                                }

                            </div>
                        </form>
                    </div>

                    {/* OTP Field */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-300 block mb-2">
                            OTP
                        </label>

                        <form onSubmit={verifyOtpValue} className="flex gap-3">
                            <input
                                disabled={!emailVerified}
                                onChange={(e) => setOtpValue(e.target.value)}
                                name='otp'
                                type="text"
                                placeholder="Enter OTP"
                                className="flex-1 bg-[#0D1D2D] border border-cyan-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00B0D3]"
                            />

                            {otpVerified ?
                                <CheckCircle size={28} className="text-[#00B0D3]" />
                                :
                                <button type='submit' className="border cursor-pointer border-[#00B0D3] text-[#00B0D3] hover:bg-[#00B0D3] hover:text-white px-4 py-2.5 rounded-lg font-semibold transition">
                                    Verify OTP
                                </button>

                            }
                        </form>
                    </div>

                    {/* OTP Field */}
                    <div className="mb-6">
                        <label className="text-sm text-gray-300 block mb-2">
                            NEW PASSWORD
                        </label>

                        <form onSubmit={createNewPassword} className="flex gap-3">
                            <input
                                name='new_password'
                                disabled={!otpVerified}
                                onChange={(e) => setNewPassword(e.target.value)}
                                type="text"
                                placeholder="Create New Password"
                                className="flex-1 bg-[#0D1D2D] border border-cyan-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00B0D3]"
                            />

                            <button type='submit' className="border cursor-pointer border-[#00B0D3] text-[#00B0D3] hover:bg-[#00B0D3] hover:text-white px-4 py-2.5 rounded-lg font-semibold transition">
                                Create
                            </button>
                        </form>
                    </div>

                    {/* Back to login */}
                    <p className="text-center text-gray-400 text-sm mt-4">
                        Remember your password?
                        <span className="text-[#00B0D3] cursor-pointer ml-1 hover:underline">
                            Login
                        </span>
                    </p>

                </div>

            </div>
        </>
    )
}