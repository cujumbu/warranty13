import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import WarrantyClaimForm from './components/WarrantyClaimForm';
import ClaimsPanel from './components/ClaimsPanel';
import LoginForm from './components/LoginForm';
import { WarrantyProvider } from './context/WarrantyContext';

function App() {
  return (
    <WarrantyProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <Link to="/" className="flex-shrink-0 flex items-center">
                    Home
                  </Link>
                  <Link to="/login" className="ml-6 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={
                <div className="bg-white shadow-xl rounded-lg p-8 max-w-2xl mx-auto">
                  <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Warranty Claim Registration</h1>
                  <WarrantyClaimForm />
                </div>
              } />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/claims" element={<ClaimsPanel />} />
            </Routes>
          </div>
        </div>
      </Router>
    </WarrantyProvider>
  );
}

export default App;