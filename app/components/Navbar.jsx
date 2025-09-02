'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    path === pathname
      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1'
      : 'text-gray-700 hover:text-blue-600';

  return (
    <nav className="bg-white shadow px-4 py-3 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex space-x-6">
        <Link href="/addSchool" className={linkClass('/addSchool')}>
          Add School
        </Link>
        <Link href="/showSchools" className={linkClass('/showSchools')}>
          Show Schools
        </Link>
      </div>
    </nav>
  );
}
