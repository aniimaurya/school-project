'use client';

import { useEffect, useState } from 'react';
import SchoolCard from '../components/SchoolCard';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch('/api/schools');
        if (!res.ok) throw new Error('Failed to fetch schools');
        const data = await res.json();
        setSchools(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSchools();
  }, []);

  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center mt-8">Loading schools...</p>;
  if (error) return <p className="text-center text-red-600 mt-8">Error: {error}</p>;
  if (!filteredSchools.length) return <p className="text-center mt-8">No schools found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Schools</h1>

      <input
        type="text"
        placeholder="Search schools by name, city, or address..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-8 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {filteredSchools.map((school) => (
          <SchoolCard key={school.id} school={school} />
        ))}
      </div>
    </div>
  );
}
