import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/shop-context";

export const Product = ({ id, name, price, image, size, color, productImage }) => {
  const { addToCart, cartItems } = useContext(ShopContext);
  const navigate = useNavigate();
  const cartItemAmount = cartItems[id];
  const [showAddedMessage, setShowAddedMessage] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Add state variables for the missing attributes
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedJerseyType, setSelectedJerseyType] = useState("HOME");
  const [selectedSize, setSelectedSize] = useState("");

  // Check if the product is a jersey by checking if it has multiple images
  // Modify the isJersey check to also look at the URL
  const isJersey = window.location.pathname.includes('/shirts/');

  const handleProductClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const attributes = {
      color: selectedColor,
      jerseyType: selectedJerseyType,
      size: selectedSize
    };
    addToCart(id, attributes);
    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 3000);
  };

  const handleJerseyTypeChange = (index, e) => {
    e.stopPropagation(); // Prevent navigation
    setCurrentImageIndex(index);
  };

  const getJerseyImage = () => {
    if (productImage && productImage[currentImageIndex]) {
      return `http://localhost:1337${productImage[currentImageIndex].url}`;
    }
    return image;
  };

  const sizes = size?.split(',').map(s => s.trim()) || [];
  const colors = color?.split(',').map(c => c.trim()) || [];

  return (
    <div className="product" style={{ height: '160px', cursor: 'pointer' }} onClick={handleProductClick}>
      <img 
        src={isJersey ? getJerseyImage() : image} 
        alt={name} 
        style={{ height: '250px', objectFit: 'contain' }} 
      />
      
      {isJersey && (
        <div className="jersey-type-buttons" style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '8px',
          position: 'absolute',
          bottom: '60px',
          left: '0',
          right: '0',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '8px'
        }}>
          <button
            className={`jersey-type-btn ${currentImageIndex === 0 ? 'active' : ''}`}
            onClick={(e) => handleJerseyTypeChange(0, e)}
            style={{
              padding: '4px 12px',
              border: currentImageIndex === 0 ? '2px solid #000' : '1px solid #ddd',
              borderRadius: '4px',
              background: currentImageIndex === 0 ? '#000' : '#fff',
              color: currentImageIndex === 0 ? '#fff' : '#000',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            HOME
          </button>
          <button
            className={`jersey-type-btn ${currentImageIndex === 1 ? 'active' : ''}`}
            onClick={(e) => handleJerseyTypeChange(1, e)}
            style={{
              padding: '4px 12px',
              border: currentImageIndex === 1 ? '2px solid #000' : '1px solid #ddd',
              borderRadius: '4px',
              background: currentImageIndex === 1 ? '#000' : '#fff',
              color: currentImageIndex === 1 ? '#fff' : '#000',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          >
            AWAY
          </button>
          {productImage && productImage.length > 2 && (
            <button
              className={`jersey-type-btn ${currentImageIndex === 2 ? 'active' : ''}`}
              onClick={(e) => handleJerseyTypeChange(2, e)}
              style={{
                padding: '4px 12px',
                border: currentImageIndex === 2 ? '2px solid #000' : '1px solid #ddd',
                borderRadius: '4px',
                background: currentImageIndex === 2 ? '#000' : '#fff',
                color: currentImageIndex === 2 ? '#fff' : '#000',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold'
              }}
            >
              THIRD
            </button>
          )}
        </div>
      )}

      <div className="description">
        <p><b>{name}</b></p>
        <p>${price}</p>
        <p className="product-details">
          {sizes.length > 0 && <span>Sizes: {sizes.join(', ')}</span>}
          {!isJersey && colors.length > 0 && <span> | Colors: {colors.join(', ')}</span>}
        </p>
      </div>

      <button 
        className="addToCartBttn" 
        onClick={handleAddToCart}
      >
        {cartItemAmount > 0 ? (
          <>Items in cart: {cartItemAmount}</>
        ) : (
          'Add To Cart'
        )}
      </button>

      {showAddedMessage && (
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
            <img 
              src={isJersey ? getJerseyImage() : image} 
              alt={name} 
              style={{ width: '60px', marginRight: '10px', borderRadius: '5px' }} 
            />
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', fontSize: '14px', margin: 0 }}>{name}</p>
              <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>{sizes.length > 0 && `Size: ${sizes[0]}`}</p>
              {!isJersey && <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>{colors.length > 0 && `Color: ${colors[0]}`}</p>}
              {isJersey && <p style={{ fontSize: '12px', color: '#555', margin: 0 }}>
                Type: {currentImageIndex === 0 ? 'HOME' : currentImageIndex === 1 ? 'AWAY' : 'THIRD'}
              </p>}
              <p style={{ fontWeight: 'bold', fontSize: '14px', margin: 0 }}>${price}</p>
            </div>
            <button onClick={() => setShowAddedMessage(false)} style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              marginLeft: 'auto'
            }}>✖</button>
          </div>
          <button onClick={(e) => {
            e.stopPropagation();
            navigate('/cart');
          }} style={{
            width: '100%',
            marginBottom: '10px',
            backgroundColor: '#fff',
            color: '#000',
            border: '1px solid #000',
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}>Afficher au panier</button>
          <button onClick={(e) => {
            e.stopPropagation();
            navigate('/payment');
          }} style={{
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
    </div>
  );
};