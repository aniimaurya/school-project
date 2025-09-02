export default function SchoolCard({ school }) {
  const { name, address, city, image } = school;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center">
      <img
        src={image}
        alt={name}
        className="w-full h-40 object-cover rounded mb-4"
        loading="lazy"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      <h2 className="text-xl font-semibold mb-2 text-gray-900">{name}</h2>
      <p className="text-gray-700 mb-1">{address}</p>
      <p className="italic text-gray-600">{city}</p>
    </div>
  );
}
