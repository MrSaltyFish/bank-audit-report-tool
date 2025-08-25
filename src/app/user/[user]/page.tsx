import { notFound } from "next/navigation";

type User = {
	id: string;
};

export default async function UserPage({
	params,
}: {
	params: { user: string };
}) {
	const par = await params;
	const userUUID = par.user;
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/user/${userUUID}`,
		{
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-store",
		},
	);

	if (!res.ok) {
		return notFound();
	}

	const user: User = await res.json();

	return (
		<div>
			<h1>User {user.id}</h1>
			{/* render more account details here */}
		</div>
	);
}
