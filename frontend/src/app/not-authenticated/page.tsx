export default function NotAuthenticatedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Not Authenticated</h1>
        <p className="text-lg text-gray-600">
          You must be logged in to access this page.
        </p>
      </div>
    </div>
  );
}
