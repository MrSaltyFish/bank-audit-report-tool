type User = {
	id: string;
};

export default async function UserPage() {
	const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		cache: "no-store",
	});

	if (!res.ok) throw new Error("Failed to fetch accounts");

	const users: User[] = await res.json();

	return (
		<div>
			<h1>Accounts</h1>
			<ul>
				{users.map((user) => (
					<li key={user.id}>
						<a href={`/user/${user.id}`}>{user.id}</a>
					</li>
				))}
			</ul>
		</div>
	);
}
