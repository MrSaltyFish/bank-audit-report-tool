"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Account = {
  id: string;
  accountNo: string;
  nameOfBorrower: string;
  sanctionedAmount: number;
  outstandingBalance: number;
  accountType: string;
  currency: string;
  otherFacilities?: string;
  dateOfSanction?: string;
};

export default function BranchPage() {
  const params = useParams();
  const bankId = params.bankId as string;
  const branchId = params.branchId as string;

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAccount, setNewAccount] = useState<Partial<Account>>({
    accountNo: "",
    nameOfBorrower: "",
    sanctionedAmount: 0,
    outstandingBalance: 0,
    accountType: "Normal",
    currency: "INR",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingAccount, setEditingAccount] = useState<Partial<Account>>({});

  // Fetch all accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch(
          `/api/banks/${bankId}/branches/${branchId}/accounts`
        );
        if (!res.ok) throw new Error("Failed to fetch accounts");
        const data = await res.json();
        setAccounts(data.accounts || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, [bankId, branchId]);

  // Create new account
  const createAccount = async () => {
    if (
      !newAccount.nameOfBorrower ||
      !newAccount.sanctionedAmount ||
      !newAccount.outstandingBalance
    )
      return alert("Please fill all required fields.");

    try {
      const res = await fetch(
        `/api/banks/${bankId}/branches/${branchId}/accounts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newAccount),
        }
      );
      const data = await res.json();
      if (data.success) setAccounts([...accounts, data.account]);
      setNewAccount({
        accountNo: "",
        nameOfBorrower: "",
        sanctionedAmount: 0,
        outstandingBalance: 0,
        accountType: "Normal",
        currency: "INR",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete account
  const deleteAccount = async (id: string) => {
    try {
      const res = await fetch(
        `/api/banks/${bankId}/branches/${branchId}/accounts/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) setAccounts(accounts.filter((acc) => acc.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Update account
  const updateAccount = async (id: string) => {
    try {
      const res = await fetch(
        `/api/banks/${bankId}/branches/${branchId}/accounts/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingAccount),
        }
      );
      const data = await res.json();
      if (data.success) {
        setAccounts(
          accounts.map((acc) => (acc.id === id ? data.account : acc))
        );
        setEditingId(null);
        setEditingAccount({});
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading accounts...</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Accounts</h1>

      {/* Create Account */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Account Number"
          value={newAccount.accountNo || ""}
          onChange={(e) =>
            setNewAccount({ ...newAccount, accountNo: e.target.value })
          }
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Borrower Name"
          value={newAccount.nameOfBorrower || ""}
          onChange={(e) =>
            setNewAccount({ ...newAccount, nameOfBorrower: e.target.value })
          }
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Sanctioned Amount"
          value={newAccount.sanctionedAmount || ""}
          onChange={(e) =>
            setNewAccount({
              ...newAccount,
              sanctionedAmount: Number(e.target.value),
            })
          }
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Outstanding Balance"
          value={newAccount.outstandingBalance || ""}
          onChange={(e) =>
            setNewAccount({
              ...newAccount,
              outstandingBalance: Number(e.target.value),
            })
          }
          className="border p-2"
        />
        <button
          onClick={createAccount}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Account
        </button>
      </div>

      {/* Accounts List */}
      <ul className="space-y-2">
        {accounts.map((acc) => (
          <li
            key={acc.id}
            className="border p-2 flex justify-between items-center"
          >
            {editingId === acc.id ? (
              <div className="flex gap-2 flex-1">
                <input
                  type="text"
                  value={editingAccount.nameOfBorrower || ""}
                  onChange={(e) =>
                    setEditingAccount({
                      ...editingAccount,
                      nameOfBorrower: e.target.value,
                    })
                  }
                  className="border p-1 flex-1"
                />
                <input
                  type="number"
                  value={editingAccount.sanctionedAmount || ""}
                  onChange={(e) =>
                    setEditingAccount({
                      ...editingAccount,
                      sanctionedAmount: Number(e.target.value),
                    })
                  }
                  className="border p-1 w-32"
                />
                <input
                  type="number"
                  value={editingAccount.outstandingBalance || ""}
                  onChange={(e) =>
                    setEditingAccount({
                      ...editingAccount,
                      outstandingBalance: Number(e.target.value),
                    })
                  }
                  className="border p-1 w-32"
                />
              </div>
            ) : (
              <span>
                {acc.accountNo} — {acc.nameOfBorrower} — ₹
                {acc.outstandingBalance}
              </span>
            )}

            <div className="flex gap-2">
              {editingId === acc.id ? (
                <>
                  <button
                    onClick={() => updateAccount(acc.id)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setEditingId(acc.id);
                      setEditingAccount(acc);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAccount(acc.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
