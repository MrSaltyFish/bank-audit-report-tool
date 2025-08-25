"use client";
import { useState, useEffect } from "react";

type Bank = {
	id: number;
	bankName: string;
};

export default function BankPage() {
	const [banks, setBanks] = useState<Bank[]>([]);
	const [insertBankName, setInsertBankName] = useState("");
	const [insertBranchName, setinsertBranchName] = useState("");
	const [deleteBankName, setDeleteBankName] = useState("");
	const server = process.env.NEXT_PUBLIC_SERVER_URL;

	useEffect(() => {
		const fetchBanks = async () => {
			try {
				const response = await fetch(`${server}/banks`, {
					credentials: "include",
				});

				if (!response.ok) {
					throw new Error("Failed to fetch Banks");
				}

				const data: Bank[] = await response.json();
				setBanks(data);
			} catch (err) {
				console.error(err);
			}
		};
		fetchBanks();
	}, [server]);

	const handleDelete = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch(`${server}/banks`, {
				method: "DELETE",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ bankName: deleteBankName }),
			});

			if (!response.ok) {
				throw new Error("Failed to fetch Banks");
			}

			const deletedBank = await response.json();

			setDeleteBankName("");
			setBanks((prev) =>
				prev.filter((value) => {
					return value.bankName !== deleteBankName;
				}),
			);
		} catch (err) {
			console.error(err);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch(`${server}/banks`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					bankName: insertBankName,
					branchLocation: insertBranchName,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create bank.");
			}

			const newBank: Bank = await response.json();
			setBanks((prev) => [...prev, newBank]);
			setInsertBankName("");
			setinsertBranchName("");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			<section id="add-bank" className="flex bg-[#343434] min-w-max p-12">
				<h1 className="stroke-2">Add Bank</h1> <br />
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						id="bank_name"
						value={insertBankName}
						onChange={(e) => setInsertBankName(e.target.value)}
						className="block bg-[#606060] border-[#505050]"
					/>
					<input
						type="text"
						id="branch_name"
						value={insertBranchName}
						onChange={(e) => setinsertBranchName(e.target.value)}
						className="block"
					/>
					<button type="submit" className="block">
						Create Bank
					</button>
				</form>
			</section>

			<section id="show-banks">
				<h1>All Banks</h1>
				<ul>
					{" "}
					{banks.map((bank) => (
						<li key={bank.id}> {bank.bankName}</li>
					))}
				</ul>
			</section>

			<section id="delete-bank">
				<h1>Delete Bank</h1>
				<form onSubmit={handleDelete}>
					<input
						type="text"
						id="bank_name"
						value={deleteBankName}
						onChange={(e) => setDeleteBankName(e.target.value)}
					/>
					<button type="submit">Delete Bank</button>
				</form>
			</section>
		</div>
	);
}
