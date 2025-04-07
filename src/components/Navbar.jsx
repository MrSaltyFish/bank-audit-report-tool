import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4 flex justify-between items-center font-[Century_Gothic] relative">
      <h1 className="text-xl font-bold text-red-500">🔥 BrandName</h1>

      <ul className="flex gap-6 text-sm">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-red-500 underline" : "hover:text-red-400"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-red-500 underline" : "hover:text-red-400"
            }
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/auth/login"
            className="text-center text-white py-1 hover:text-red-600"
          >
            Login
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
