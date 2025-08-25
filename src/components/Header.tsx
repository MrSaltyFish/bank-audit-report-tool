"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
// import { useEffect } from 'react';
// import gsap from 'gsap';

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Login", href: "/auth/login" },
  { name: "Register", href: "/auth/register" },
  { name: "Dashboard", href: "/dashboard" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          B.A.R.T
        </h1>
        <nav className="space-x-6 flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
