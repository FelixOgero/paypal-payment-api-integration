import { useEffect, useState } from "react";
import axios from "axios";

function PaymentStatus({ orderId }) {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchPaymentStatus = async () => {
      try {
        // const response = await axios.get(`/api/payments/${orderId}`);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/payments/${orderId}`
        );

        setPayment(response.data);
      } catch (err) {
        console.error("Error fetching payment status:", err);
        setError("Could not retrieve payment information");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [orderId]);

  if (loading) return <p>Loading payment information...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!payment) return <p>No payment information found</p>;

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Order ID:</span> {payment.orderId}
        </p>
        <p>
          <span className="font-medium">Status:</span> {payment.status}
        </p>
        <p>
          <span className="font-medium">Amount:</span> $
          {payment.amount.toFixed(2)} {payment.currency}
        </p>
        <p>
          <span className="font-medium">Date:</span>{" "}
          {new Date(payment.createdAt).toLocaleString()}
        </p>
        {payment.payerEmail && (
          <p>
            <span className="font-medium">Payer Email:</span>{" "}
            {payment.payerEmail}
          </p>
        )}
        {payment.payerName && (
          <p>
            <span className="font-medium">Payer Name:</span> {payment.payerName}
          </p>
        )}
      </div>
    </div>
  );
}

export default PaymentStatus;
