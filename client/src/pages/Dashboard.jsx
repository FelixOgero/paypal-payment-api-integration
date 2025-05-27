import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('/api/payments');
        setPayments(response.data);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setError('Could not retrieve payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600';
      case 'CREATED':
      case 'SAVED':
      case 'APPROVED':
        return 'text-blue-600';
      case 'VOIDED':
      case 'FAILED':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) return <p className="text-center py-8">Loading payments...</p>;
  if (error) return <p className="text-red-500 text-center py-8">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payment Dashboard</h1>
        <Link 
          to="/" 
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Make New Payment
        </Link>
      </div>
      
      {payments.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No payment history found</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.orderId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.orderId.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${payment.amount.toFixed(2)} {payment.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`${getStatusColor(payment.status)} font-semibold`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      to={`/success?orderId=${payment.orderId}`}
                      className="text-blue-500 hover:underline">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;