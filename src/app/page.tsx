import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main */}
      <main className="flex-grow container mx-auto px-4 mt-10 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Welcome to <span className="font-bold">B.A.R.T</span>, the Bank Audit
          Report Tool
        </h2>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          Login or Register to manage and view bank details, make queries, and
          generate reports!
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/auth/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
          >
            Login
          </Link>
          <Link
            href="/auth/register"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
