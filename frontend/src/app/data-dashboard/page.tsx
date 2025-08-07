// app/data-dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL!;

export default function DataDashboard() {
  const searchParams = useSearchParams();
  const bankId = searchParams.get("bankId");
  const [bankName, setBankName] = useState("");
  const [entry, setEntry] = useState({
    accountNo: "",
    nameOfBorrower: "",
    dateOfSanctionRenewal: "",
    sanctionedAmount: "",
    outstandingBalance: "",
    otherFacilities: "",
  });
  const [observation, setObservation] = useState({
    accountNo: "",
    query: "",
    details: "",
  });
  const [fetchAccount, setFetchAccount] = useState("");
  const [fetchedDetails, setFetchedDetails] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!bankId) return;
    fetch(`${SERVER_URL}/bank/get-bank`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bankId }),
    })
      .then((res) => res.json())
      .then((data) => setBankName(data.bankName))
      .catch(() => setBankName(`Bank ID: ${bankId}`));
  }, [bankId]);

  const handleLogout = async () => {
    await fetch(`${SERVER_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("jwtToken");
    router.push("/auth/login");
  };

  const createEntry = async (e: any) => {
    e.preventDefault();
    await fetch(`${SERVER_URL}/master/create-entry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...entry, bankID: bankId }),
    });
    alert("Entry created");
    setEntry({
      accountNo: "",
      nameOfBorrower: "",
      dateOfSanctionRenewal: "",
      sanctionedAmount: "",
      outstandingBalance: "",
      otherFacilities: "",
    });
  };

  const addObservation = async (e: any) => {
    e.preventDefault();
    await fetch(`${SERVER_URL}/query/add-query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(observation),
    });
    alert("Query added");
    setObservation({ accountNo: "", query: "", details: "" });
  };

  const getDetails = async (e: any) => {
    e.preventDefault();
    const res = await fetch(`${SERVER_URL}/master/get-details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountNo: fetchAccount }),
    });
    const data = await res.json();
    setFetchedDetails(data);
  };

  const generateReport = async () => {
    const res = await fetch(`${SERVER_URL}/report/generate-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bankId, format: "word" }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Report_Bank_${bankId}.docx`;
    a.click();
    a.remove();
  };

  return (
    <div className="p-6 space-y-10">
      <header className="bg-black text-white text-center py-4 text-2xl font-bold">
        Data Dashboard
      </header>

      <nav className="flex gap-4 justify-center text-blue-600 underline">
        <a href="/dashboard">Bank Dashboard</a>
        <button onClick={handleLogout} className="text-red-600">
          Logout
        </button>
      </nav>

      <section>
        <h2 className="text-xl font-semibold">Create Entry - {bankName}</h2>
        <form
          onSubmit={createEntry}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {Object.entries(entry).map(([key, value]) => (
            <input
              key={key}
              type={
                key.includes("Amount")
                  ? "number"
                  : key.includes("date")
                  ? "date"
                  : "text"
              }
              value={value}
              onChange={(e) =>
                setEntry((prev) => ({ ...prev, [key]: e.target.value }))
              }
              placeholder={key}
              className="border p-2"
              required={key !== "otherFacilities"}
            />
          ))}
          <button className="bg-blue-600 text-white p-2 rounded" type="submit">
            Submit
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Add Observation</h2>
        <form
          onSubmit={addObservation}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            value={observation.accountNo}
            onChange={(e) =>
              setObservation({ ...observation, accountNo: e.target.value })
            }
            placeholder="Account No"
            className="border p-2"
            required
          />
          <input
            value={observation.query}
            onChange={(e) =>
              setObservation({ ...observation, query: e.target.value })
            }
            placeholder="Query"
            className="border p-2"
            required
          />
          <textarea
            value={observation.details}
            onChange={(e) =>
              setObservation({ ...observation, details: e.target.value })
            }
            placeholder="Details"
            className="border p-2 col-span-2"
          />
          <button className="bg-blue-600 text-white p-2 rounded" type="submit">
            Add
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Get Bank Details</h2>
        <form onSubmit={getDetails} className="flex gap-4">
          <input
            value={fetchAccount}
            onChange={(e) => setFetchAccount(e.target.value)}
            placeholder="Account Number"
            className="border p-2 flex-1"
            required
          />
          <button className="bg-blue-600 text-white p-2 rounded" type="submit">
            Get
          </button>
        </form>
        <div className="mt-4">
          {fetchedDetails.length === 0 ? (
            <p>No results</p>
          ) : (
            fetchedDetails.map((item) => (
              <div key={item._id} className="border p-4 my-2 bg-gray-100">
                <h3 className="font-semibold">Account: {item.accountNo}</h3>
                <p>
                  <strong>Query:</strong> {item.query}
                </p>
                <p>
                  <strong>Details:</strong> {item.details}
                </p>
                <p className="text-sm text-gray-500">ID: {item._id}</p>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Generate Report</h2>
        <button
          onClick={generateReport}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Generate .docx Report
        </button>
      </section>
    </div>
  );
}
