"use client"

import { BACKEND_URL } from "@/config/data"
import axios from "axios"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"

type FormValues = {
    email: string
    password: string
}

export function Signin() {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>()

    const onSubmit = async (data: FormValues) => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/v1/login`, data,{withCredentials: true,})

            localStorage.setItem("token", res.data.token)
            router.push("/")
        } catch (err: any) {
            setError("root", {
                message: err.response?.data?.message || "Login failed",
            })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center  from-blue-100 via-white to-indigo-200 px-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl p-8 space-y-6"
            >
                {/* Header */}
                <div className="text-center space-y-1">
                    <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
                    <p className="text-gray-500 text-sm">Start your journey with us 🚀</p>
                </div>


                {/* Email */}
                <Input
                    label="Email"
                    placeholder="Enter email"
                    error={errors.email?.message}
                    {...register("email", {
                        required: "Email required",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email",
                        },
                        validate: (v) => !v.startsWith(" ") || "Email cannot start with space",
                    })}
                />

                {/* Password */}
                <Input
                    type="password"
                    label="Password"
                    placeholder="Enter password"
                    error={errors.password?.message}
                    {...register("password", {
                        required: "Password required",
                        minLength: {
                            value: 6,
                            message: "Minimum 6 characters",
                        },
                        validate: (v) => !v.startsWith(" ") || "password cannot start with space",
                    })}
                />

                {errors.root && (
                    <p className="text-red-500">{errors.root.message}</p>
                )}

                {/* Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {isSubmitting ? (
                        <>
                            <Loader className="animate-spin w-5 h-5" />
                        </>
                    ) : (
                        "Sign In"
                    )}
                </button>

                <p className="text-center text-sm text-gray-500">
                    create an account?{" "}
                    <span onClick={() => router.push("signUp")} className="text-blue-600 font-medium cursor-pointer hover:underline">
                        Sign Up
                    </span>
                </p>
            </form>
        </div>
    )
}


const Input = ({
    label,
    error,
    type = "text",
    ...props
}: any) => {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>

            <input
                type={type}
                {...props}
                className={`w-full px-4 h-11 rounded-xl border bg-white outline-none transition
        focus:ring-2 focus:ring-blue-500
        ${error ? "border-red-500" : "border-gray-300"}
        `}
            />

            {error && <p className="text-red-500 text-xs">{error}</p>}
        </div>
    )
}