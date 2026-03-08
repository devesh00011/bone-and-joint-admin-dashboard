'use client'
import React, { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import Loading from "../../../Loading";
import { post_api } from "../api_helper/api_helper";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setAdminLogin } from "../redux/slices/adminAuthSlice";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Form() {
    const [loading, setLoading] = useState(false)
    const [otpTab, setOtpTab] = useState(false)
    const router = useRouter()

    const [adminEmail, setAdminEmail] = useState('')
    const [adminPassword, setAdminPassword] = useState('')


    const dispatch = useDispatch()
    const token = useSelector((store) => store.adminAuth.token)
    console.log(token)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)


        const userDataObj = {
            admin_email: adminEmail,
            admin_password: adminPassword
        }
        try {
            const response = await post_api({
                body: userDataObj,
                params: null,
                path: 'admin/login'
            })

            if (response.data.success) {

                localStorage.setItem("admin_id", response.data.admin_id)
                setOtpTab(true)

                Swal.fire({
                    title: 'Otp Sent To Your Email',
                    icon: "success",
                    text: 'check your mail to verify'
                })
            }
            else {
                Swal.fire({
                    title: 'Warning',
                    text: 'Email and Password are Invalid',
                    icon: 'warning'
                })
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Server Error',
                icon: 'error'
            })
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (otpTab) {
            router.push('/verify-otp')
        }
    }, [otpTab])

    return (
        <>
            {loading && <Loading />}
            <div className="bg-[#0D1D2D] h-screen flex items-center justify-center text-white">

                <div className="w-[470] bg-[#13293D] p-8 rounded-2xl shadow-lg border border-[#1B3A57]">

                    {/* Logo / Title */}
                    <div className="flex flex-col items-center mb-8">
                        <img className="w-24 h-24 object-cover object-center rounded-full" src="/logo-white.PNG" />
                        <h1 className="text-2xl font-bold">Bone & Joint Hospital</h1>
                        <p className="text-gray-400 text-sm">Admin Login</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-300 text-sm">Email</label>

                            <div className="flex items-center bg-[#0D1D2D] border border-gray-600 rounded-md px-3">
                                <MdEmail className="text-[#00B0D3] text-lg" />
                                <input
                                    onChange={(e) => setAdminEmail(e.target.value)}
                                    required
                                    name='admin_email'
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-3 py-4 bg-transparent outline-none"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-300 text-sm">Password</label>

                            <div className="flex items-center bg-[#0D1D2D] border border-gray-600 rounded-md px-3">
                                <RiLockPasswordFill className="text-[#00B0D3] text-lg" />
                                <input
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    required
                                    name="admin_password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full px-3 py-4 bg-transparent outline-none"
                                />
                            </div>
                        </div>

                        <Link href={'/forgot-password'}> <span className="cursor-pointer hover:text-cyan-600 duration-100">Forgot Password ?</span></Link>

                        {/* Button */}
                        <button
                            type="submit"
                            className="mt-4 bg-[#00B0D3] py-3 rounded-md font-semibold text-lg hover:bg-cyan-700 transition"
                        >
                            Login
                        </button>

                    </form>
                </div>

            </div>
        </>
    );
}