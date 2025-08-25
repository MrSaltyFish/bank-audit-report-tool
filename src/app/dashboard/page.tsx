"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Bank = {
    _id: string;
    bankName: string;
    branchName: string;
    branchLocation: string;
};

export default function Dashboard() {
    const [banks, setBanks] = useState<Bank[]>([]);
    const [bankName, setBankName] = useState("");
    const [branchName, setBranchName] = useState("");
    const [branchLocation, setBranchLocation] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const SERVER_URL =
        process.env.NEXT_PUBLIC_SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL;

    const fetchBanks = async () => {
        try {
            const res = await fetch(`${SERVER_URL}/bank/get-banks`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();
            setBanks(data);
        } catch (error) {
            console.error("Error fetching banks:", error);
        }
    };

    const handleAddBank = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!bankName || !branchName || !branchLocation) {
            setMessage("All fields are required!");
            return;
        }

        try {
            const response = await fetch(`${SERVER_URL}/bank/add-bank`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bankName, branchName, branchLocation }),
            });
            const data = await response.json();
            setMessage(data.message);
            setBankName("");
            setBranchName("");
            setBranchLocation("");
            fetchBanks();
        } catch (err) {
            console.error("Error adding bank:", err);
        }
    };

    const handleDeleteBank = async (bankId: string) => {
        if (!confirm("Are you sure you want to delete this bank?")) return;
        try {
            const res = await fetch(`${SERVER_URL}/bank/delete-bank/${bankId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            alert(data.message);
            fetchBanks();
        } catch (err) {
            console.error("Error deleting bank:", err);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch(`${SERVER_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            localStorage.removeItem("jwtToken");
            router.push("/login");
        } catch (err) {
            alert("Error logging out");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Nav */}
            <nav className="bg-gray-100 py-3 px-6 flex justify-between items-center">
                <div className="space-x-4">
                    <a href="/dashboard" className="text-blue-600 hover:underline">
                        Bank Dashboard
                    </a>
                    <a href="/bankDetails" className="text-blue-600 hover:underline">
                        View Bank Data
                    </a>
                </div>
                <button
                    onClick={handleAddBank: React.FormEvent}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                Logout
            </button>
        </nav>

            {/* Form */ }
    <main className="flex-grow px-6 py-10">
        <section className="max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-semibold mb-4">Add Bank</h2>
            <form onSubmit={handleAddBank} className="space-y-4">
                <input
                    type="text"
                    placeholder="Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Branch Name"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Branch Location"
                    value={branchLocation}
                    onChange={(e) => setBranchLocation(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
                >
                    Add Bank
                </button>
                {message && <p className="text-sm text-gray-700">{message}</p>}
            </form>
        </section>

        {/* Bank Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {banks.map((bank) => (
                <div
                    key={bank._id}
                    className="border rounded-lg p-4 shadow bg-white"
                >
                    <h3 className="text-xl font-bold">{bank.bankName}</h3>
                    <p className="text-gray-600">Branch: {bank.branchName}</p>
                    <p className="text-gray-600">Location: {bank.branchLocation}</p>
                    <div className="mt-3 flex justify-end">
                        <button
                            onClick={() => handleDeleteBank(bank._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded"
                        >
                            Delete Bank
                        </button>
                    </div>
                </div>
            ))}
        </section>
    </main>
        </div >
    );
}
