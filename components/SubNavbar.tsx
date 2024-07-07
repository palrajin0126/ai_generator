// components/CategoryNavbar.js
"use client";
import Link from "next/link";

function CategoryNavbar() {
  return (
    <nav className="bg-gray-200 p-4 flex justify-between items-center">
      <ul className="flex items-center justify-between w-full">
        <li className="mr-4">
          <Link href="/blogLandingpage" className="text-gray-700">
            Blog Landing Page
          </Link>
        </li>
        <li className="mr-4">
          <Link href="/addBackend" className="text-gray-700">
            Add Backend
          </Link>
        </li>
        <li className="mr-4">
          <Link href="/generateTest" className="text-gray-700">
            Generate Test
          </Link>
        </li>
        <li>
          <Link href="/addDatabase" className="text-gray-700">
            Add Database
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default CategoryNavbar;