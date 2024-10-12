import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Claim {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  orderNumber: string;
  returnAddress: string;
  brand: string;
  problem: string;
}

const AdminPanel: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get(`/api/claims`);
        console.log('API response:', response.data);
        if (Array.isArray(response.data)) {
          setClaims(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setError('Received unexpected data format from server.');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching claims:', err);
        setError('Failed to fetch claims. Please try again later.');
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Warranty Claims Admin Panel</h1>
      {claims.length === 0 ? (
        <p>No claims found.</p>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Order Number</th>
              <th className="px-4 py-2 border">Brand</th>
              <th className="px-4 py-2 border">Problem</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.id}>
                <td className="px-4 py-2 border">{claim.id}</td>
                <td className="px-4 py-2 border">{claim.name}</td>
                <td className="px-4 py-2 border">{claim.email}</td>
                <td className="px-4 py-2 border">{claim.phoneNumber}</td>
                <td className="px-4 py-2 border">{claim.orderNumber}</td>
                <td className="px-4 py-2 border">{claim.brand}</td>
                <td className="px-4 py-2 border">{claim.problem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;