import React, { useEffect, useContext, useState } from "react";
import { useGetProaccQuery } from "../services/productService";
import { ShopContext } from "../context/shop-context";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../pages/shop/shop.css";

const Footer = () => (
  <footer className="section__container footer__container" style={{ 
    minHeight: "300px",
    padding: "40px 0",
    borderTop: "1px solid rgb(253, 253, 253)",
    color: "#212529",
    fontSize: "14px",
    lineHeight: "2",
  }}>
    <div className="footer__col">
      <h4 className="footer__heading">CONTACT INFO</h4>
      <p><i className="ri-map-pin-2-fill"></i> 13 RUE BAB ENNACER QU MLY ELHASSANE SAFI</p>
      <p><i className="ri-mail-fill"></i> youssefhdilisse5@gmail.com</p>
      <p><i className="ri-phone-fill"></i> (+212) 678102292</p>
    </div>
    <div className="footer__col">
      <h4 className="footer__heading">COMPANY</h4>
      <p>Home</p>
      <p>About Us</p>
      <p>Work With Us</p>
      <p>Our Blog</p>
      <p>Terms & Conditions</p>
    </div>
    <div className="footer__col">
      <h4 className="footer__heading">COPYRIGHT</h4>
      <p>&copy; 2025 YourCompanyName. All rights reserved. Use of this site constitutes acceptance of our 
      <a href="/terms-and-conditions" style={{ color: "#0d6efd", textDecoration: "none" }}> Terms and Conditions</a></p>
    </div>
    <div className="footer__col">
      <h4 className="footer__heading">ADVERTISING POSTER</h4>
      <div className="instagram__grid" style={{ 
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        marginTop: "15px"
      }}>
        <img src="/assets/products/1.jpg" alt="instagram" style={{ width: "100%", height: "auto" }} />
        <img src="/assets/products/5.jpg" alt="instagram" style={{ width: "100%", height: "auto" }} />
        <img src="/assets/products/3.jpg" alt="instagram" style={{ width: "100%", height: "auto" }} />
        <img src="/assets/products/2.jpg" alt="instagram" style={{ width: "100%", height: "auto" }} />
        <img src="/assets/products/4.jpg" alt="instagram" style={{ width: "100%", height: "auto" }} />
        <img src="/assets/products/6.jpg" alt="instagram" style={{ width: "100%", height: "auto" }} />
      </div>
    </div>
  </footer>
);

export const Accessories = () => {
  const { addToCart, cartItems } = useContext(ShopContext);
  const { data, error, isLoading } = useGetProaccQuery();
  const [showAddedMessage, setShowAddedMessage] = useState(false); // State for showing message
  const [addedProduct, setAddedProduct] = useState(null); // State for added product details
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    console.log("API Response:", data);
  }, [data]);

  const getImageUrl = (proacc) => {
    if (proacc?.productImage?.length > 0) {
      const imageUrl = `http://localhost:1337${proacc.productImage[0].url}`;
      console.log("Image URL:", imageUrl);
      return imageUrl;
    }
    const fallbackImage = `/assets/accessories/${proacc.id}.jpg`;
    console.warn("Using fallback image:", fallbackImage);
    return fallbackImage;
  };

  const handleAddToCart = (proacc) => {
    addToCart(proacc.id);
    setAddedProduct(proacc); // Set the added product details
    setShowAddedMessage(true); // Show message
    setTimeout(() => setShowAddedMessage(false), 3000); // Hide message after 3 seconds
  };

  if (isLoading) return <div className="loading">Loading accessories...</div>;
  if (error) {
    console.error("Error fetching accessories:", error);
    return <div className="error">Error loading accessories: {error.message}</div>;
  }

  return (
    <div className="shop">
      <div className="shopTitle"></div>
      <div className="products" style={{
        width: '100%',
        height: 'auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        placeItems: 'center',
        gap: '20px'
      }}>
        {data?.data?.map((proacc) => {
          const cartItemAmount = cartItems[proacc.id] || 0; // Get the current amount in the cart

          return (
            <div key={proacc.id} className="product" style={{
              borderRadius: '15px',
              width: '300px',
              height: '350px',
              margin: '30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <img 
                src={getImageUrl(proacc)} 
                alt={proacc.productName}
                style={{ 
                  width: '250px',
                  height: '200px',
                  pointerEvents: 'none',
                  objectFit: 'contain'
                }}
              />
              <div className="description">
                <p style={{ fontWeight: 'bold', fontSize: '16px' }}><b>{proacc.productName}</b></p>
                <p style={{ fontWeight: 'bold', fontSize: '16px' }}>${proacc.price}</p>
              </div>
              <button 
                className="addToCartBttn"
                onClick={() => handleAddToCart(proacc)}
              >
                Add To Cart {cartItemAmount > 0 && <> ({cartItemAmount})</>}
              </button>
            </div>
          );
        })}
      </div>
      {showAddedMessage && addedProduct && (
        <div className="added-message" style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#fff',
          color: '#000',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          width: '350px',
          border: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', width: '100%' }}>
            <img src={getImageUrl(addedProduct)} alt={addedProduct.productName} style={{ width: '60px', marginRight: '10px', borderRadius: '5px' }} />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', fontSize: '14px', margin: 0 }}>{addedProduct.productName}</p>
              <p style={{ fontSize: '12px', color: '#555', margin: 0 }}></p>
              <p style={{ fontWeight: 'bold', fontSize: '14px', margin: 0 }}>${addedProduct.price}</p>
            </div>
            <button onClick={() => setShowAddedMessage(false)} style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}>✖</button>
          </div>
          <button onClick={() => navigate('/cart')} style={{
            width: '100%',
            marginBottom: '10px',
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #000',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>Afficher au panier</button> {/* Use cartItems to get the amount */}
          <button onClick={() => navigate('/payment')} style={{
            width: '100%',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>Paiement</button>
        </div>
      )}
      <section className="section__container brands__container">
        <div className="brand__image">
          <img src="/assets/products/brand-1.png" alt="brand" />
        </div>
        <div className="brand__image">
          <img src="/assets/products/brand-2.png" alt="brand" />
        </div>
        <div className="brand__image">
          <img src="/assets/products/brand-6.png" alt="brand" />
        </div>
        <div className="brand__image">
          <img src="/assets/products/brand-5.png" alt="brand" />
        </div>
        <div className="brand__image">
          <img src="/assets/products/kappa.jpg" alt="brand" />
        </div>
        <div className="brand__image">
          <img src="/assets/products/macron.jpg" alt="brand" />
        </div>
      </section>
      <Footer />
    </div>
  );
};