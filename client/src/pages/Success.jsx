import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PaymentStatus from '../components/PaymentStatus';

function Success() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 text-green-500 mx-auto"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h1 className="text-2xl font-bold mt-4">Payment Successful!</h1>
        <p className="text-gray-600 mt-2">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>
      </div>
      
      {orderId && <PaymentStatus orderId={orderId} />}
      
      <div className="mt-8 space-x-4">
        <Link 
          to="/" 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Return to Checkout
        </Link>
        <Link 
          to="/dashboard" 
          className="inline-block bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Success;