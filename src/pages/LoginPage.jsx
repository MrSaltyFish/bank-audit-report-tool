import React from "react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-red-600">
      <div className="bg-gray-900 p-8 m-8 rounded-2xl shadow-lg w-full max-w-md">
        <span>Placeholder for an image</span>
      </div>

      <div className="bg-gray-900 p-8 m-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6">Log In</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-300 transition"
          >
            Log In
          </button>
        </form>
        <div className="mt-6 text-center">
          New to <span className="font-semibold">B.A.R.T</span>?{" "}
          <button
            onClick={() => (window.location.href = "/signup")}
            className="text-blue-400 hover:underline font-medium"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
