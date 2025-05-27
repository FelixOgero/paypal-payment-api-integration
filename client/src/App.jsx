import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import Checkout from './pages/Checkout';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import Dashboard from './pages/Dashboard';

const paypalOptions = {
  'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
};

function App() {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      <Router>
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;