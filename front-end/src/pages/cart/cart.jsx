import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/shop-context";
import { useGetProductsQuery, useGetProshirtsQuery, useGetProaccQuery } from "../../services/productService";
import { CartItem } from "./cart-item";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../../services/authService";
import { FaTrash } from 'react-icons/fa';
import "./cart.css";

export const Cart = () => {
  const { cartItems, setCartItems, removeFromCart } = useContext(ShopContext);
  const [allProducts, setAllProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Load cart items from local storage on mount
    try {
      const stored = localStorage.getItem("cartItems");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === "object" && parsed !== null) {
          setCartItems(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load cartItems from localStorage", e);
    }
  }, [setCartItems]);

  useEffect(() => {
    // Save cart items to local storage whenever they change
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to save cartItems to localStorage", e);
    }
  }, [cartItems]);

  useEffect(() => {
    const calculateSubtotal = () => {
      const newSubtotal = Object.entries(cartItems).reduce((acc, [key, item]) => {
        const [productId] = key.split('-');
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

  const handlePaymentClick = () => {
    const isAuthenticated = authService.isAuthenticated();
    if (isAuthenticated) {
      const cartItemsList = Object.entries(cartItems)
        .filter(([key, item]) => item.quantity > 0)
        .map(([key, item]) => {
          const [productId] = key.split('_');
          const product = allProducts.find(p => p.id === parseInt(productId));
          return {
            id: parseInt(productId),
            name: product?.productName,
            price: product?.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            jerseyType: item.jerseyType,
            productType: location.pathname.includes('/shirts/') ? 'jersey' : 
                        location.pathname.includes('/product/') ? 'shoe' : 'accessory'
          };
        });

      navigate("/payment", { 
        state: { 
          items: cartItemsList,
          total: subtotal
        }
      });
    } else {
      navigate("/signin", { state: { redirectTo: "/payment" } });
    }
  };

  const { data: products } = useGetProductsQuery();
  const { data: shirts } = useGetProshirtsQuery();
  const { data: accessories } = useGetProaccQuery();

  useEffect(() => {
    const productsData = products?.data || [];
    const shirtsData = shirts?.data || [];
    const accessoriesData = accessories?.data || [];
    
    setAllProducts([...productsData, ...shirtsData, ...accessoriesData]);
  }, [products, shirts, accessories]);

  return (
    <div className="cart">
      <div>
        <h1>Your Cart Items</h1>
      </div>
      <div className="cartItems">
        {Object.entries(cartItems).map(([key, item]) => {
          const [productId, size, color, jerseyType] = key.split('_');
          const product = allProducts.find(p => p.id === parseInt(productId));
          
          if (product && item.quantity > 0) {
            return (
              <div key={key} className="cart-item-container">
                <CartItem
                  id={parseInt(productId)}
                  name={product.productName}
                  price={product.price}
                  size={size}
                  color={color}
                  jerseyType={jerseyType}
                  quantity={item.quantity}
                  image={product.productImage?.[0]?.url 
                    ? `http://localhost:1337${product.productImage[jerseyType === 'AWAY' ? 1 : jerseyType === 'THIRD' ? 2 : 0].url}`
                    : `/assets/products/${productId}.jpg`}
                />
                <button 
                  className="delete-button"
                  onClick={() => removeFromCart(productId, { 
                    size: item.size, 
                    color: item.color, 
                    jerseyType: item.jerseyType 
                  })}
                >
                  <FaTrash />
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
      {Object.values(cartItems).some(item => item.quantity > 0) ? (
        <div className="checkout">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <div>
            <button onClick={() => navigate("/shop")}>Continue Shopping</button>
            <button onClick={handlePaymentClick}>Checkout</button>
          </div>
        </div>
      ) : (
        <h2>Your cart is empty</h2>
      )}
    </div>
  );
};
