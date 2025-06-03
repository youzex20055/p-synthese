import React, { useState } from "react";
import "./PaymentForm.css";

const PaymentForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    cardHolder: "",
    email: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    phoneNumber: "",
    address: "",
    city: "",
    zipCode: "",
    country: ""
  });

  const [errors, setErrors] = useState({});
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    
    if (validateForm()) {
      try {
        // Add shipping address and phone number to form data
        const shippingAddress = `${formData.address || ''}, ${formData.city || ''}, ${formData.zipCode || ''}, ${formData.country || ''}`;
        const customerInfo = {
          ...formData,
          shippingAddress
        };
        
        console.log('Processing payment with customer info:', customerInfo);
        
        // Direct implementation of order creation to bypass potential issues
        try {
          // Get cart items from localStorage
          const cartString = localStorage.getItem('cart');
          let cartItems = {};
          try {
            cartItems = JSON.parse(cartString || '{}');
          } catch (e) {
            console.error('Error parsing cart items:', e);
            cartItems = {};
          }
          
          // Format order items as JSON array
          const orderItemsArray = Object.entries(cartItems)
            .filter(([_, item]) => item.quantity > 0)
            .map(([key, item]) => {
              const [productId] = key.split('_');
              return {
                productId: parseInt(productId),
                quantity: item.quantity,
                size: item.size || '',
                color: item.color || '',
                jerseyType: item.jerseyType || '',
                colorArray: Array.isArray(item.colorArray) ? item.colorArray : [],
                selectedColorIndex: typeof item.selectedColorIndex === 'number' ? item.selectedColorIndex : -1
              };
            });
          
          // Create order object
          const order = {
            id: Date.now(), // Use timestamp as ID
            customerName: customerInfo.cardHolder,
            email: customerInfo.email,
            orderItems: orderItemsArray,
            totalAmount: 99.99, // Dummy value or calculate from cart
            shippingAddress: customerInfo.shippingAddress,
            phoneNumber: customerInfo.phoneNumber || 'Not provided',
            paymentMethod: 'credit_card',
            paymentStatus: 'paid',
            orderStatus: 'processing',
            orderDate: new Date().toISOString()
          };
          
          console.log('Order created:', order);
          
          // Store order in localStorage
          const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          existingOrders.push(order);
          localStorage.setItem('orders', JSON.stringify(existingOrders));
          
          // Clear cart
          localStorage.removeItem('cart');
          
          // Show success message
          setIsPaymentComplete(true);
          
          // Send confirmation email
          try {
            const response = await fetch('http://localhost:1337/api/global/send-payment-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: formData.email }),
            });

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error?.message || 'Failed to send confirmation email');
            }

            console.log('Confirmation email sent successfully');
          } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
            // Don't throw the error to prevent disrupting the payment flow
            // Just log it for debugging purposes
          }
          
        } catch (orderError) {
          console.error('Order creation error:', orderError);
          throw new Error(`Failed to create order: ${orderError.message}`);
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        setEmailError(error.message || 'Payment processing failed');
      }
    }
  };

  if (isPaymentComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="success-page">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="success-title">Payment confirmed!</h2>
          <p className="success-message">
            Thanks for your payment. You will receive an email confirmation shortly at {formData.email}
          </p>
          <button 
            onClick={() => window.location.href = '/cart'}
            className="download-button"
          >
            View downloads
          </button>
        </div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    
    // Card Holder validation
    if (!formData.cardHolder.trim()) {
      newErrors.cardHolder = "Name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }

    // Card Number validation
    const cardNumberRegex = /^[0-9]{16}$/;
    if (!cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = "Valid 16-digit card number is required";
    }

    // Expiry Date validation
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(formData.expiryDate)) {
      newErrors.expiryDate = "Valid date (MM/YY) is required";
    }

    // CVV validation
    const cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(formData.cvv)) {
      newErrors.cvv = "Valid CVV is required";
    }
    
    // Phone number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    // Zip code validation
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required";
    }
    
    // Country validation
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'expiryDate') {
      // Remove any non-digits
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      
      // Add slash after MM if there are more than 2 digits
      if (cleaned.length >= 2) {
        formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else if (name === 'cvv') {
      const cleaned = value.replace(/\D/g, '').slice(0, 4);
      setFormData(prev => ({
        ...prev,
        [name]: cleaned
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      {/* Payment Method Buttons */}
      <div className="payment-methods">
        <button type="button" className="payment-method-btn">
          <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="payment-icon" />
          <span>PayPal</span>
        </button>
        <button type="button" className="payment-method-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Pay" className="payment-icon" />
          <span>Apple Pay</span>
        </button>
        <button type="button" className="payment-method-btn">
          <img src="/assets/products/!2.png" alt="Google Pay" className="payment-icon" />
          <span>Google Pay</span>
        </button>
      </div>

      <p className="payment-divider">or pay using credit card</p>
      
      {/* Shipping Information */}
      <div className="form-section">
        <h3 className="section-title">Shipping Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Your phone number"
              className={errors.phoneNumber ? 'error' : ''}
            />
            {errors.phoneNumber && <p className="error-text">{errors.phoneNumber}</p>}
          </div>
        </div>
        
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address"
            className={errors.address ? 'error' : ''}
          />
          {errors.address && <p className="error-text">{errors.address}</p>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <p className="error-text">{errors.city}</p>}
          </div>
          
          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              placeholder="Zip code"
              className={errors.zipCode ? 'error' : ''}
            />
            {errors.zipCode && <p className="error-text">{errors.zipCode}</p>}
          </div>
        </div>
        
        <div className="form-group">
          <label>Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country"
            className={errors.country ? 'error' : ''}
          />
          {errors.country && <p className="error-text">{errors.country}</p>}
        </div>
      </div>
      
      <div className="form-section">
        <h3 className="section-title">Payment Details</h3>
        
        {/* Card Holder Name */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Card holder full name</label>
          <input
            type="text"
            name="cardHolder"
            value={formData.cardHolder}
            onChange={handleChange}
            placeholder="Enter your full name"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 ${errors.cardHolder ? 'border-red-500' : ''}`}
          />
          {errors.cardHolder && <p className="text-red-500 text-xs mt-1">{errors.cardHolder}</p>}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 ${errors.email || emailError ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
        </div>

        {/* Card Number */}
        <div className="form-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 16);
              const formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
              setFormData(prev => ({
                ...prev,
                cardNumber: formattedValue
              }));
            }}
            placeholder="0000 0000 0000 0000"
            maxLength="19"
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 ${errors.cardNumber ? 'border-red-500' : ''}`}
          />
          {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
        </div>

        {/* Expiry Date / CVV */}
        <div className="flex gap-2 mb-4">
          <div className="w-1/2">
            <label className="block text-sm mb-1">Expiry Date</label>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 ${errors.expiryDate ? 'border-red-500' : ''}`}
            />
            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
          </div>
          <div className="w-1/2">
            <label className="block text-sm mb-1">CVV</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="CVV"
              maxLength="4"
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300 ${errors.cvv ? 'border-red-500' : ''}`}
            />
            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <button 
        type="submit" 
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Complete Order'}
      </button>
    </form>
  );
};

export default PaymentForm;