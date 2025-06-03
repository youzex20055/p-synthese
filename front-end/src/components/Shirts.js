import React, { useEffect, useState } from "react";
import { useGetProshirtsQuery } from "../services/productService";
import { Product } from "../pages/shop/product";
import "../pages/shop/shop.css";

// Separate Footer component
const Footer = () => (
  <footer className="section__container footer__container" style={{ minHeight: "300px" }}>
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
      <a href="/terms-and-conditions"> Terms and Conditions</a></p>
    </div>
    <div className="footer__col">
      <h4 className="footer__heading">ADVERTISING POSTER</h4>
      <div className="instagram__grid">
        <img src="/assets/products/1.jpg" alt="instagram" />
        <img src="/assets/products/5.jpg" alt="instagram" />
        <img src="/assets/products/3.jpg" alt="instagram" />
        <img src="/assets/products/2.jpg" alt="instagram" />
        <img src="/assets/products/4.jpg" alt="instagram" />
        <img src="/assets/products/6.jpg" alt="instagram" />
      </div>
    </div>
  </footer>
);

// New JerseyTypeSelector component
const JerseyTypeSelector = ({ currentImageIndex, setCurrentImageIndex, hasThirdKit }) => {
  return (
    <div className="jersey-type-selector">
      <button 
        className={`type-btn ${currentImageIndex === 0 ? 'active' : ''}`}
        onClick={() => setCurrentImageIndex(0)}
      >
        HOME
      </button>
      <button 
        className={`type-btn ${currentImageIndex === 1 ? 'active' : ''}`}
        onClick={() => setCurrentImageIndex(1)}
      >
        AWAY
      </button>
      {hasThirdKit && (
        <button 
          className={`type-btn ${currentImageIndex === 2 ? 'active' : ''}`}
          onClick={() => setCurrentImageIndex(2)}
        >
          THIRD
        </button>
      )}
    </div>
  );
};

// New ProductGrid component
const ProductGrid = ({ products, currentImageIndex }) => {
  const getImageUrl = (proshirt) => {
    if (proshirt?.productImage?.length > 0) {
      if (proshirt.productImage[currentImageIndex]) {
        return `http://localhost:1337${proshirt.productImage[currentImageIndex].url}`;
      }
      return `http://localhost:1337${proshirt.productImage[0].url}`;
    }
    return `/assets/shirts/${proshirt.id}.jpg`;
  };

  return (
    <div className="products">
      {products?.map((proshirt) => (
        <Product 
          key={proshirt.id}
          id={proshirt.id}
          name={proshirt.productName}
          price={proshirt.price}
          image={getImageUrl(proshirt)}
          productImage={proshirt.productImage}
          size={proshirt.size}
          color={proshirt.color}
        />
      ))}
    </div>
  );
};

// Main Shirts component
export const Shirts = () => {
  const { data, error, isLoading } = useGetProshirtsQuery();

  useEffect(() => {
    console.log("API Response:", data);
  }, [data]);

  const getImageUrl = (proshirt) => {
    if (proshirt?.productImage?.length > 0) {
      return `http://localhost:1337${proshirt.productImage[0].url}`;
    }
    return `/assets/shirts/${proshirt.id}.jpg`;
  };

  if (isLoading) return <div className="loading">Loading shirts...</div>;
  if (error) {
    console.error("Error fetching shirts:", error);
    return <div className="error">Error loading shirts: {error.message}</div>;
  }

  return (
    <div className="shop">
      <div className="shopTitle">
        {/* Removed jersey type selector from here */}
      </div>
      <div className="products">
        {data?.data?.map((proshirt) => (
          <Product 
            key={proshirt.id}
            id={proshirt.id}
            name={proshirt.productName}
            price={proshirt.price}
            image={getImageUrl(proshirt)}
            productImage={proshirt.productImage}
            size={proshirt.size}
            color={proshirt.color}
          />
        ))}
      </div>
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
