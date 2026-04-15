import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Lock, CreditCard, CheckCircle, XCircle } from 'lucide-react';

const API_URL = "https://tarek-payment-api.onrender.com/api"; 

function PaymentPage() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const quickAmounts = [10, 25, 50, 100];

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      const data = await response.json();

      if (response.ok && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError(data.error || 'Failed to initialize payment.');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error. Please make sure the backend is running.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-200 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all">
        <div className="bg-blue-600 p-6 text-center text-white">
          <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-2xl font-bold">TY</span>
          </div>
          <h1 className="text-2xl font-bold">Tarek Yassine</h1>
          <p className="text-blue-100 mt-1">طارق ياسين</p>
          <p className="text-sm text-blue-200 mt-2 flex justify-center items-center gap-1">
            <Lock size={14} /> Secure Payment Page
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handlePayment}>
            <label className="block text-gray-700 font-semibold mb-2">Enter Amount (OMR)</label>
            
            <div className="grid grid-cols-4 gap-2 mb-4">
              {quickAmounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmount(amt)}
                  className={`py-2 rounded-lg border font-medium transition ${
                    Number(amount) === amt 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>

            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">OMR</span>
              <input
                type="number"
                step="0.100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.000"
                className="w-full pl-14 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg font-semibold text-gray-800"
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <CreditCard size={20} /> Pay Now
                </>
              )}
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Lock size={14} /> Payments securely processed by Thawani
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function SuccessPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">Thank you. Your payment to Tarek Yassine has been securely processed.</p>
        <button onClick={() => navigate('/')} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition">Return to Home</button>
      </div>
    </div>
  );
}

function CancelPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">You have cancelled the payment process. No charges were made.</p>
        <button onClick={() => navigate('/')} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-900 transition">Try Again</button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PaymentPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
      </Routes>
    </Router>
  );
}
