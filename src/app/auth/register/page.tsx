"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                },
            );

            const data = await response.json();
            const text = data?.error ?? data ?? "Unknown error";
            if (response.status === 201) {
                setMessage({
                    type: "success",
                    text: "Register successful! Redirecting to login...",
                });
                setTimeout(() => {
                    router.push("/auth/login");
                }, 1500);
            } else {
                setMessage({
                    type: "warning",
                    text:
                        JSON.stringify(data.error) || "Register failed. Please try again.",
                });
            }
        } catch (error) {
            console.error("Register Error:", error);
            setMessage({
                type: "error",
                text: "Something went wrong. Please try again later.",
            });
        }
    };

    const alertStyle =
        {
            success: "bg-green-100 text-green-700",
            warning: "bg-yellow-100 text-yellow-800",
            error: "bg-red-100 text-red-700",
        }[message.type] ?? "";

    return (
        <div className="min-h-screen flex flex-col text-black">
            <main className="flex-grow flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-center mb-6">
                        Create an Account
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4 ">
                        <div>
                            <label htmlFor="username" className="block font-medium">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block font-medium">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {message.text && (
                            <div className={`text-sm rounded px-3 py-2 ${alertStyle}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
                        >
                            Register
                        </button>
                    </form>

                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/auth/login" className="text-blue-600 hover:underline">
                            Login
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
