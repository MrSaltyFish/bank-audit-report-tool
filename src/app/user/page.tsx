import { cookies } from "next/headers";
import { notFound } from "next/navigation";

type Bank = {
	id: string;
	bankName: string;
	slug: string;
};

type UserData = {
	userId: string;
	banks: Bank[];
};

export default async function UserPage() {
	try {
		const cookieStore = await cookies(); // ✅ await it
		const token = cookieStore.get("auth-token")?.value;
		if (!token) return notFound();

		const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`, {
			headers: {
				cookie: `auth-token=${token}`,
			},
			cache: "no-store",
		});

		if (!res.ok) return notFound();

		const data: UserData = await res.json();
		console.log(data);

		return (
			<div className="p-6">
				<h1 className="text-2xl font-bold mb-4">User Banks</h1>

				{data.banks.length === 0 && <p>No banks found.</p>}

				<ul className="space-y-2">
					{data.banks.map((bank) => (
						<li key={bank.id} className="border rounded p-3 shadow bg-white">
							{bank.bankName} (Slug: {bank.slug})
						</li>
					))}
				</ul>
			</div>
		);
	} catch (err) {
		console.error("Failed to load user banks:", err);
		return notFound();
	}
}
