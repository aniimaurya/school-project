'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function AddSchool() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const onSubmit = async (data) => {
    setSubmitting(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('state', data.state);
      formData.append('contact', data.contact);
      formData.append('email_id', data.email_id);
      formData.append('image', data.image[0]); // Append image file

      const res = await fetch('/api/schools', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setMessage('School added successfully!');
        reset();
      } else {
        const errorData = await res.json();
        setMessage(`Error: ${errorData.error || 'Failed to add school'}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Add School</h1>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-6">
        {[
          { label: 'Name', name: 'name', type: 'text', placeholder: 'School Name' },
          { label: 'Address', name: 'address', type: 'text', placeholder: 'Address' },
          { label: 'City', name: 'city', type: 'text', placeholder: 'City' },
          { label: 'State', name: 'state', type: 'text', placeholder: 'State' },
          {
            label: 'Contact Number',
            name: 'contact',
            type: 'tel',
            placeholder: 'Contact Number',
            pattern: {
              value: /^[0-9]{10,15}$/,
              message: 'Enter a valid contact number',
            },
          },
          {
            label: 'Email',
            name: 'email_id',
            type: 'email',
            placeholder: 'Email',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Enter a valid email',
            },
          },
        ].map(({ label, name, type, placeholder, pattern }) => (
          <div key={name}>
            <label className="block font-semibold mb-1 text-gray-700" htmlFor={name}>
              {label}
            </label>
            <input
              id={name}
              type={type}
              placeholder={placeholder}
              {...register(name, { required: `${label} is required`, pattern })}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors[name] ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors[name] && (
              <p className="text-red-600 mt-1 text-sm">{errors[name].message}</p>
            )}
          </div>
        ))}

        <div>
          <label className="block font-semibold mb-1 text-gray-700" htmlFor="image">
            Image
          </label>
          <input
            id="image"
            type="file"
            accept="image/*"
            {...register('image', { required: 'Image is required' })}
            className={`w-full ${errors.image ? 'border-red-500' : ''}`}
          />
          {errors.image && (
            <p className="text-red-600 mt-1 text-sm">{errors.image.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:bg-blue-400 transition"
        >
          {submitting ? 'Submitting...' : 'Add School'}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center font-semibold ${
            message.toLowerCase().includes('error') ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
