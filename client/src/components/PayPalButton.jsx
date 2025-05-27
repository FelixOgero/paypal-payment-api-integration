import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PayPalButton({ items, total }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call our backend to create a PayPal order
      const response = await axios.post('/api/payments/create-order', {
        items,
        total
      });
      
      // Redirect to PayPal approval URL
      window.location.href = response.data.approvalUrl;
    } catch (err) {
      console.error('Error initiating PayPal payment:', err);
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5">
      {error && <div className="text-red-500 mb-3">{error}</div>}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay with PayPal'}
      </button>
    </div>
  );
}

export default PayPalButton;