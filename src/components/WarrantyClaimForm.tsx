import React, { useState, useContext } from 'react';
import { WarrantyContext } from '../context/WarrantyContext';
import { AlertTriangle } from 'lucide-react';

const WarrantyClaimForm: React.FC = () => {
  const { submitClaim, getBrandNotice } = useContext(WarrantyContext);
  const [formData, setFormData] = useState({
    email: '',
    emailConfirmation: '',
    name: '',
    phoneNumber: '',
    orderNumber: '',
    returnAddress: '',
    brand: '',
    problem: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brandNotice, setBrandNotice] = useState('');
  const [claimNumber, setClaimNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'brand') {
      const notice = getBrandNotice(value);
      setBrandNotice(notice);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (formData.email !== formData.emailConfirmation) newErrors.emailConfirmation = 'Emails do not match';
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.orderNumber) newErrors.orderNumber = 'Order number is required';
    if (!formData.returnAddress) newErrors.returnAddress = 'Return address is required';
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.problem) newErrors.problem = 'Problem description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      try {
        console.log('Submitting form data:', formData);
        const number = await submitClaim(formData);
        console.log('Received claim number:', number);
        setClaimNumber(number);
      } catch (error) {
        console.error('Error in handleSubmit:', error);
        setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Email confirmation field */}
      <div>
        <label htmlFor="emailConfirmation" className="block text-sm font-medium text-gray-700">Confirm Email</label>
        <input
          type="email"
          id="emailConfirmation"
          name="emailConfirmation"
          value={formData.emailConfirmation}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
        {errors.emailConfirmation && <p className="text-red-500 text-xs mt-1">{errors.emailConfirmation}</p>}
      </div>

      {/* Name field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Phone Number field */}
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
        {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
      </div>

      {/* Order Number field */}
      <div>
        <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700">Order Number</label>
        <input
          type="text"
          id="orderNumber"
          name="orderNumber"
          value={formData.orderNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
        {errors.orderNumber && <p className="text-red-500 text-xs mt-1">{errors.orderNumber}</p>}
      </div>

      {/* Return Address field */}
      <div>
        <label htmlFor="returnAddress" className="block text-sm font-medium text-gray-700">Return Address</label>
        <textarea
          id="returnAddress"
          name="returnAddress"
          value={formData.returnAddress}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        ></textarea>
        {errors.returnAddress && <p className="text-red-500 text-xs mt-1">{errors.returnAddress}</p>}
      </div>

      {/* Brand field */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
        <select
          id="brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        >
          <option value="">Select a brand</option>
          <option value="Seiko">Seiko</option>
          <option value="Casio">Casio</option>
          <option value="Timex">Timex</option>
          <option value="Other">Other</option>
        </select>
        {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
      </div>

      {/* Brand Notice */}
      {brandNotice && (
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{brandNotice}</p>
            </div>
          </div>
        </div>
      )}

      {/* Problem Description field */}
      <div>
        <label htmlFor="problem" className="block text-sm font-medium text-gray-700">Problem Description</label>
        <textarea
          id="problem"
          name="problem"
          value={formData.problem}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        ></textarea>
        {errors.problem && <p className="text-red-500 text-xs mt-1">{errors.problem}</p>}
      </div>

      {/* Submit button */}
      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Warranty Claim'}
        </button>
      </div>

      {/* Error message */}
      {submitError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-400 rounded-md">
          <p className="text-red-700">Error submitting claim: {submitError}</p>
          <p className="text-sm text-red-600 mt-2">Please try again or contact support if the problem persists.</p>
        </div>
      )}

      {/* Success message */}
      {claimNumber && (
        <div className="mt-4 p-4 bg-green-50 border border-green-400 rounded-md">
          <p className="text-green-700">Your warranty claim has been submitted successfully.</p>
          <p className="text-green-700 font-bold">Claim Number: {claimNumber}</p>
          <p className="text-sm text-green-600 mt-2">Please keep this number for your records. You MUST provide this number when sending your item for warranty service.</p>
        </div>
      )}
    </form>
  );
};

export default WarrantyClaimForm;