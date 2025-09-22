import { useState } from "react";
import { Link } from "react-router-dom";
import PayPalButton from "../components/PayPalButton";

function Checkout() {
  // Sample product data
  const products = [
    {
      id: 1,
      name: "Basic Plan",
      description: "Monthly subscription",
      price: 9.99,
    },
    {
      id: 2,
      name: "Premium Plan",
      description: "Monthly subscription with extra features",
      price: 19.99,
    },
    {
      id: 3,
      name: "Enterprise Plan",
      description: "Monthly subscription for large teams",
      price: 49.99,
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [quantity, setQuantity] = useState(1);

  const handleProductChange = (e) => {
    const productId = parseInt(e.target.value);
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
  };

  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  const totalAmount = selectedProduct.price * quantity;

  // Prepare items for PayPal
  const items = [
    {
      name: selectedProduct.name,
      description: selectedProduct.description,
      quantity: quantity,
      unitAmount: selectedProduct.price,
    },
  ];

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="mb-4">
        <label className="block mb-2">Select a Plan</label>
        <select
          value={selectedProduct.id}
          onChange={handleProductChange}
          className="w-full p-2 border rounded"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} - ${product.price.toFixed(2)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Quantity</label>
        <input
          type="number"
          min="1"
          max="10"
          value={quantity}
          onChange={handleQuantityChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="font-semibold mb-3">Order Summary</h2>
        <div className="flex justify-between mb-2">
          <span>
            {selectedProduct.name} x {quantity}
          </span>
          <span>${(selectedProduct.price * quantity).toFixed(2)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <PayPalButton items={items} total={totalAmount.toFixed(2)} />

      <div className="mt-4">
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          View Payment Dashboard
        </Link>
        <a
          href="https://github.com/FelixOgero/intasend-payment-api-integration"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginTop: "20px",
            color: "#0366d6",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "16px",
            // textAlign: "center",
          }}
        >
          View GitHub Repository
        </a>
      </div>
    </div>
  );
}

export default Checkout;
