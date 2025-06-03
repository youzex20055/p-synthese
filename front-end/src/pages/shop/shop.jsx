import React, { useEffect } from "react";
import { useGetProductsQuery } from "../../services/productService";
import { Product } from "./product";
import "./shop.css";

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

export const Shop = () => {
  const { data, error, isLoading } = useGetProductsQuery();

  useEffect(() => {
    console.log("API Response:", data);
  }, [data]);

  const getImageUrl = (product) => {
    if (product?.productImage?.length > 0) {
      const imageUrl = `http://localhost:1337${product.productImage[0].url}`;
      console.log("Image URL:", imageUrl);
      return imageUrl;
    }
    const fallbackImage = `/assets/products/${product.id}.jpg`;
    console.warn("Using fallback image:", fallbackImage);
    return fallbackImage;
  };

  if (isLoading) return <div className="loading">Loading products...</div>;
  if (error) {
    console.error("Error fetching products:", error);
    return <div className="error">Error loading products: {error.message}</div>;
  }

  return (
    <div className="shop">
      <div className="shopTitle"></div>
      <div className="products">
        {data?.data?.map((product) => (
          <Product 
            key={product.id}
            id={product.id}
            name={product.productName}
            price={product.price}
            image={getImageUrl(product)}
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
          <img src="/assets/products/mizo.png" alt="brand" />
        </div>
        
      </section>
      <Footer />
    </div>
  );
};
