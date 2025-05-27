import { Link, useSearchParams } from 'react-router-dom';

function Cancel() {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="mb-8">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 text-red-500 mx-auto"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        <h1 className="text-2xl font-bold mt-4">Payment Cancelled</h1>
        <p className="text-gray-600 mt-2">
          {error 
            ? 'There was an error processing your payment.' 
            : 'Your payment process was cancelled.'}
        </p>
      </div>
      
      <div className="mt-8">
        <Link 
          to="/" 
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Return to Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cancel;