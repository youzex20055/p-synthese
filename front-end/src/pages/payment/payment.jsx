import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShopContext } from "../../context/shop-context";
import { useGetProductsQuery, useGetProshirtsQuery, useGetProaccQuery } from "../../services/productService";
import PaymentForm from "./PaymentForm";
import "./PaymentForm.css";

export const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, setCartItems, clearCart } = useContext(ShopContext);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  
  // Track loading state for order creation
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  // Fetch product data
  const { data: products } = useGetProductsQuery();
  const { data: shirts } = useGetProshirtsQuery();
  const { data: accessories } = useGetProaccQuery();

  // Combine all products
  useEffect(() => {
    const productsData = products?.data || [];
    const shirtsData = shirts?.data || [];
    const accessoriesData = accessories?.data || [];
    
    setAllProducts([...productsData, ...shirtsData, ...accessoriesData]);
  }, [products, shirts, accessories]);

  // Calculate subtotal
  useEffect(() => {
    const calculateSubtotal = () => {
      const newSubtotal = Object.entries(cartItems).reduce((acc, [key, item]) => {
        const [productId] = key.split('_');
        const product = allProducts.find(p => p.id === parseInt(productId));
        if (product) {
          return acc + (product.price * item.quantity);
        }
        return acc;
      }, 0);
      setSubtotal(newSubtotal);
    };

    calculateSubtotal();
  }, [cartItems, allProducts]);

  // Handle checkout and save order to Strapi
  const handleCheckout = async (customerInfo) => {
    try {
      setIsCreatingOrder(true);
      setOrderError("");
      
      // Map cart items to order items format
      const orderItems = Object.entries(cartItems)
        .filter(([_, item]) => item.quantity > 0)
        .map(([key, item]) => {
          const [productId] = key.split('_');
          const product = allProducts.find(p => p.id === parseInt(productId));
          
          return {
            productId: parseInt(productId),
            productName: product?.productName || 'Unknown Product',
            price: product?.price || 0,
            quantity: item.quantity,
            size: item.size || '',
            color: item.color || '',
            jerseyType: item.jerseyType || '',
            colorArray: item.colorArray || [],
            selectedColorIndex: item.selectedColorIndex || -1
          };
        });

      // Create order data
      const orderData = {
        customerName: customerInfo.cardHolder,
        email: customerInfo.email,
        orderItems: JSON.stringify(orderItems),
        totalAmount: subtotal,
        shippingAddress: customerInfo.shippingAddress || 'Not provided',
        phoneNumber: customerInfo.phoneNumber || 'Not provided',
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        orderStatus: 'processing',
        orderDate: new Date().toISOString()
      };

      // Save order to Strapi using fetch directly
      const response = await fetch('http://localhost:1337/api/commandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: orderData })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        console.log('Order created successfully:', data);
        // Clear cart after successful order
        clearCart();
        setOrderComplete(true);
      } else {
        console.error('Error creating order:', data);
        setOrderError('Failed to create order. Please try again.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      setOrderError('An unexpected error occurred. Please try again.');
    }
  };

  // If no items in cart, redirect to cart page
  useEffect(() => {
    if (Object.values(cartItems).every(item => !item.quantity)) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  if (orderComplete) {
    return (
      <div className="order-success">
        <div className="success-container">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase. Your order has been received and is being processed.</p>
          <button onClick={() => navigate('/shop')} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-summary">
          <h2>Order Summary</h2>
          <div className="cart-items-summary">
            {Object.entries(cartItems).map(([key, item]) => {
              if (item.quantity <= 0) return null;
              
              const [productId] = key.split('_');
              const product = allProducts.find(p => p.id === parseInt(productId));
              
              if (!product) return null;
              
              return (
                <div key={key} className="cart-item-summary">
                  <div className="item-info">
                    <p className="item-name">{product.productName}</p>
                    <p className="item-details">
                      {item.size && `Size: ${item.size}`}
                      {item.color && ` | Color: ${item.color}`}
                      {item.jerseyType && ` | Type: ${item.jerseyType}`}
                    </p>
                    <p className="item-quantity">Qty: {item.quantity}</p>
                  </div>
                  <p className="item-price">${(product.price * item.quantity).toFixed(2)}</p>
                </div>
              );
            })}
          </div>
          <div className="order-total">
            <p>Total</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="payment-form-container">
          <h2>Payment Details</h2>
          {orderError && <div className="error-message">{orderError}</div>}
          <PaymentForm onSubmit={handleCheckout} isLoading={isCreatingOrder} />
        </div>
      </div>
    </div>
  );
};