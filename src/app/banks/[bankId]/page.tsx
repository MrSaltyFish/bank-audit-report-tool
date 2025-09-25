"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Branch = {
  id: string;
  branchName: string;
};

export default function BankPage() {
  const params = useParams();
  const bankId = params.bankId as string;
  const server = process.env.NEXT_PUBLIC_SERVER_URL;
  if (!server) throw new Error("NEXT_PUBLIC_SERVER_URL is not defined");

  const [branches, setBranches] = useState<Branch[]>([]);
  const [createBranchName, setCreateBranchName] = useState("");
  const [renameBranchId, setRenameBranchId] = useState("");
  const [renameBranchName, setRenameBranchName] = useState("");

  // Fetch branches
  const fetchBranches = async () => {
    try {
      const res = await fetch(`${server}/api/banks/${bankId}/branches`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch branches");
      const data = await res.json();
      setBranches(data.bankBranches || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [bankId]);

  // Create branch
  const handleCreate = async () => {
    if (!createBranchName) return;
    try {
      await fetch(`${server}/api/banks/${bankId}/branches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ branchName: createBranchName }),
      });
      setCreateBranchName("");
      fetchBranches();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete branch
  const handleDelete = async (id: string) => {
    try {
      await fetch(`${server}/api/branches/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      fetchBranches();
    } catch (err) {
      console.error(err);
    }
  };

  // Rename branch
  const handleRename = async (id: string) => {
    if (!renameBranchName) return;
    try {
      await fetch(`${server}/api/branches/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ branchName: renameBranchName }),
      });
      setRenameBranchId("");
      setRenameBranchName("");
      fetchBranches();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-12 bg-[#343434] text-white min-h-screen space-y-12">
      <h1 className="text-2xl font-bold">Branches: {bankId} </h1>

      {/* Branches List */}
      <ul className="space-y-2">
        {branches.map((branch) => (
          <li
            key={branch.id}
            className="flex items-center gap-4 bg-[#606060] p-2 rounded"
          >
            <span className="flex-1">
              {renameBranchId === branch.id ? (
                <input
                  type="text"
                  value={renameBranchName}
                  onChange={(e) => setRenameBranchName(e.target.value)}
                  className="p-1 text-black"
                  placeholder="New name"
                />
              ) : (
                branch.branchName
              )}
            </span>
            {renameBranchId === branch.id ? (
              <>
                <button
                  onClick={() => handleRename(branch.id)}
                  className="bg-yellow-600 p-1 px-2 hover:bg-yellow-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setRenameBranchId("")}
                  className="bg-gray-600 p-1 px-2 hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setRenameBranchId(branch.id);
                    setRenameBranchName(branch.branchName);
                  }}
                  className="bg-blue-600 p-1 px-2 hover:bg-blue-700"
                >
                  Rename
                </button>
                <button
                  onClick={() => handleDelete(branch.id)}
                  className="bg-red-600 p-1 px-2 hover:bg-red-700"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Create Branch */}
      <div className="space-y-2 mt-6">
        <input
          type="text"
          placeholder="Branch Name"
          value={createBranchName}
          onChange={(e) => setCreateBranchName(e.target.value)}
          className="p-2 bg-[#606060] border border-[#505050]"
        />
        <button
          onClick={handleCreate}
          className="bg-green-600 p-2 mt-2 hover:bg-green-700"
        >
          Create Branch
        </button>
      </div>
    </div>
  );
}
