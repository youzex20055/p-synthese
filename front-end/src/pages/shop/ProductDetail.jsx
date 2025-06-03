import React, { useState, useContext, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ShopContext } from "../../context/shop-context";
import { useGetProductsQuery, useGetProshirtsQuery } from "../../services/productService";
import "./ProductDetail.css";
import { FaArrowLeft, FaArrowRight, FaChevronLeft } from 'react-icons/fa';

export const ProductDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart, cartItems, isJerseyItem } = useContext(ShopContext);
  const navigate = useNavigate();
  
  // Define isJersey using the consistent function from context
  const isJersey = isJerseyItem(id);
  
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedJerseyType, setSelectedJerseyType] = useState(isJersey ? "HOME" : "");
  const [colorArray, setColorArray] = useState([]);

  // Add this at the top of your component, after isJersey is defined
  const jerseyTypes = ["HOME", "AWAY", "THIRD"];

  // Add this effect to update jersey type when image changes
  useEffect(() => {
    if (isJersey) {
      setSelectedJerseyType((jerseyTypes[currentImageIndex] || "HOME").toUpperCase());
    }
  }, [currentImageIndex, isJersey]);

  const handleAddToCart = () => {
    // Validation checks
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (isJersey && !selectedJerseyType) {
      alert("Please select a jersey type (HOME/AWAY/THIRD)");
      return;
    }

    if (!isJersey && getAvailableColors().length > 0 && !selectedColor) {
      alert("Please select a color");
      return;
    }

    console.log('Adding to cart with attributes:', {
      size: selectedSize,
      color: !isJersey ? selectedColor : '',
      jerseyType: isJersey ? selectedJerseyType : '',
      currentImageIndex,
      selectedJerseyType,
      isJersey,
      colorArray,
      selectedColorIndex: selectedColor ? colorArray.indexOf(selectedColor) : -1
    });

    const attributes = {
      size: selectedSize,
      color: !isJersey ? selectedColor : '',
      jerseyType: isJersey ? selectedJerseyType : '',
      colorArray: !isJersey ? colorArray : [], // Save the color array for shoes
      selectedColorIndex: !isJersey && selectedColor ? colorArray.indexOf(selectedColor) : -1 // Save the selected color index
    };
    
    addToCart(product.id, attributes);

    // Show added to cart message
    const addedMessage = document.createElement('div');
    addedMessage.className = 'added-message';
    addedMessage.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 10px; width: 100%;">
        <img src="${getImageUrl(product)}" alt="${product.productName}" style="width: 60px; margin-right: 10px; border-radius: 5px;" />
        <div style="flex: 1;">
          <p style="font-weight: bold; font-size: 14px; margin: 0;">${product.productName}</p>
          <p style="font-size: 12px; color: #555; margin: 0;">Size: ${selectedSize}</p>
          ${isJersey ? `<p style="font-size: 12px; color: #555; margin: 0;">Type: ${selectedJerseyType}</p>` : ''}
          ${!isJersey && selectedColor ? `<p style="font-size: 12px; color: #555; margin: 0;">Color: ${selectedColor}</p>` : ''}
          <p style="font-weight: bold; font-size: 14px; margin: 0;">$${product.price}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 16px; cursor: pointer; margin-left: auto;">✖</button>
      </div>
      <button onclick="window.location.href='/cart'" style="width: 100%; margin-bottom: 10px; background-color: #fff; color: #000; border: 1px solid #000; padding: 10px; border-radius: 5px; cursor: pointer;">View Cart</button>
      <button onclick="window.location.href='/payment'" style="width: 100%; background-color: #000; color: #fff; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Proceed to Payment</button>
    `;
    addedMessage.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background-color: #fff;
      color: #000;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      width: 350px;
      border: 1px solid #ccc;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;
    document.body.appendChild(addedMessage);
    setTimeout(() => addedMessage.remove(), 5000);
  };

  // Add this function to handle jersey type changes
  const handleJerseyTypeChange = (type, index) => {
    setSelectedJerseyType(jerseyTypes[index] || "HOME");
    setCurrentImageIndex(index);
  };

  // Default options
  const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
  const shirtSizes = ["S", "M", "L", "XL", "XXL"];

  // Map colors to image indices
  const colorImageMap = {
    "Black": 0,
    "White": 1,
    "ORANGE": 2,
    "Red": 3,
    "Blue": 4,
    "GREN": 5
  };

  const { 
    data: productsData, 
    error: productsError, 
    isLoading: productsLoading 
  } = useGetProductsQuery();

  const {
    data: shirtsData,
    error: shirtsError,
    isLoading: shirtsLoading
  } = useGetProshirtsQuery();

  useEffect(() => {
    const pathname = location.pathname.toLowerCase();
    console.log('=== Debug Info ===');
    console.log('Current pathname:', pathname);
    console.log('Current ID:', id);
    console.log('Shirts Data:', shirtsData);

    const isProduct = pathname.includes("/product/");
    const isShirts = pathname.includes("/shirts/");

    // Check shirts data first if it's a shirt ID
    if (shirtsData?.data) {
      const foundShirt = shirtsData.data.find(item => item.id === parseInt(id));
      if (foundShirt) {
        setProduct({
          id: foundShirt.id,
          productName: foundShirt.productName,
          price: foundShirt.price,
          productImage: foundShirt.productImage || [],
          colors: foundShirt.color || [] // Changed from attributes?.colors to color
        });
        setColorArray(foundShirt.color || []);
        return;
      }
    }

    // If not found in shirts, check regular products
    if (productsData?.data) {
      const foundProduct = productsData.data.find(item => item.id === parseInt(id));
      if (foundProduct) {
        setProduct({
          id: foundProduct.id,
          productName: foundProduct.productName,
          price: foundProduct.price,
          productImage: foundProduct.productImage || [],
          colors: foundProduct.color || [] // Changed from attributes?.colors to color
        });
        setColorArray(foundProduct.color || []);
      }
    }
  }, [id, location.pathname, productsData, shirtsData]);

  const getProductImages = (item) => {
    const images = [];
    const pathname = location.pathname.toLowerCase();
    
    if (pathname.includes("/shirts/")) {
      if (item?.productImage) {
        item.productImage.forEach(image => {
          if (image.url) {
            images.push(`http://localhost:1337${image.url}`);
          }
        });
      }
      if (images.length === 0) {
        images.push(`/assets/shirts/${item.id}.jpg`);
      }
    } else {
      if (item?.productImage?.length > 0) {
        item.productImage.forEach(image => {
          images.push(`http://localhost:1337${image.url}`);
        });
      }
      if (images.length === 0) {
        images.push(`/assets/products/${item.id}.jpg`);
      }
    }
    return images;
  };

  // Remove duplicate loading and error checks, keep only one set
  if ((productsLoading && location.pathname.includes("/product/")) || 
      (shirtsLoading && location.pathname.includes("/proshirt/"))) {
    return <div className="loading">Loading...</div>;
  }
  if (productsError || shirtsError) return <div className="error">Error loading product</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  const getImages = (item) => {
    const images = [];
    if (location.pathname.includes("/proshirt/")) {
      if (item?.productImage) {
        item.productImage.forEach(image => {
          if (image.url) {
            images.push(`http://localhost:1337${image.url}`);
          }
        });
      }
    } else {
      if (item?.productImage?.length > 0) {
        item.productImage.forEach(image => {
          images.push(`http://localhost:1337${image.url}`);
        });
      }
    }
    if (images.length === 0) {
      images.push(`/assets/products/${item.id}.jpg`);
    }
    return images;
  };

  // Update loading checks
  if ((productsLoading && location.pathname.includes("product")) || 
      (shirtsLoading && location.pathname.includes("shirts"))) {
    return <div className="loading">Loading...</div>;
  }
  if (productsError || shirtsError) return <div className="error">Error loading product</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  const getImageUrl = (item) => {

    if (location.pathname.includes("proshirt")) {
      // Handle shirt images from Strapi
      if (item?.productImage?.[0]?.url) {
        return `http://localhost:1337${item.productImage[0].url}`;
      }
    } else {
      // Handle product images
      if (item?.productImage?.length > 0) {
        return `http://localhost:1337${item.productImage[0].url}`;
      }
    }
    return `/assets/products/${item.id}.jpg`;
  };

  // Add navigation functions
  const nextImage = () => {
    const images = getImages(product);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = getImages(product);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (productsLoading) return <div className="loading">Loading...</div>;
  if (productsError) return <div className="error">Error loading product</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  // Add this function before the return statement
    const getSizes = () => {
      // Check if the current product exists in shirtsData
      const isShirtProduct = shirtsData?.data?.some(item => item.id === parseInt(id));
      return isShirtProduct ? shirtSizes : shoeSizes;
    };
  
    // Add this function before the return statement
      const isAccessory = () => {
        return location.pathname.toLowerCase().includes("/accessories/");
      };
  
      const getAvailableColors = () => {
        console.log('Product colors:', product?.colors); // Add this line
        if (!product?.colors) return [];
        return product.colors;
      };
  
      // Update the color selection handler
      const handleColorSelect = (color) => {
        setSelectedColor(color);
        // Get the index of the color in the colors array to match with image index
        const colorIndex = colorArray.indexOf(color);
        if (colorIndex !== -1) {
          setCurrentImageIndex(colorIndex);
        }
      };
      const cartItemKey = `${product.id}_${selectedSize}_${selectedColor || ''}_${selectedJerseyType || ''}`;
      return (
        <div className="product-detail">
          <button className="back-button" onClick={() => navigate(-1)}>
            <FaChevronLeft className="back-icon" />
          </button>

          <div className="product-image-container">
            <div className="image-navigation">
              <button className="slider-btn prev" onClick={prevImage}>
                <FaArrowLeft />
              </button>
    
              <div className="main-image">
                <img 
                  src={getImages(product)[currentImageIndex]}
                  alt={`${product.productName} view ${currentImageIndex + 1}`}
                />
              </div>
    
              <button className="slider-btn next" onClick={nextImage}>
                <FaArrowRight />
              </button>
            </div>
            
            <div className="image-thumbnails">
              {getImages(product).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`thumbnail ${currentImageIndex === index ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    if (isJersey) setSelectedJerseyType((jerseyTypes[index] || 'HOME').toUpperCase());
                  }}
                />
              ))}
            </div>
          </div>
          <div className="product-info">
            <h1>{product.productName}</h1>
            <p className="price">${product.price}</p>
  
            {!isAccessory() && (
              <>
                <div className="size-selection">
                  <h3>Size</h3>
                  <div className="size-options">
                    {getSizes().map((size) => (
                      <button
                        key={size}
                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {!isJersey && getAvailableColors().length > 0 && (
                  <div className="color-selection">
                    <h3>Color</h3>
                    <div className="color-options">
                      {getAvailableColors().map((color) => (
                        <button
                          key={color}
                          className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                          onClick={() => handleColorSelect(color)}
                          data-color={color.toLowerCase()}
                        >
                          <span className="checkmark">✓</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!isAccessory() && !getAvailableColors().length && product?.productImage && (
                  <div className="jersey-type-selection">
                    <h3>Jersey Type</h3>
                    <div className="jersey-options">
                      {jerseyTypes.map((type, idx) => (
                        <button
                          key={type}
                          className={`jersey-btn ${selectedJerseyType === type ? "active" : ""}`}
                          onClick={() => handleJerseyTypeChange(type, idx)}
                          disabled={idx >= (product.productImage?.length || 0)}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            <button 
              className="addToCartBttn" 
              onClick={handleAddToCart}
              style={{
                width: '100%',
                padding: '14px 0',
                background: 'linear-gradient(90deg, #ff9800 0%, #ff5722 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '18px',
                letterSpacing: '1px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                margin: '24px 0 16px 0',
                transition: 'background 0.2s, transform 0.1s'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ff5722 0%, #ff9800 100%)'}
              onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #ff9800 0%, #ff5722 100%)'}
            >
              {cartItems[cartItemKey]?.quantity > 0 ? (
                <>Items in cart: {cartItems[cartItemKey]?.quantity}</>
              ) : (
                'Add To Cart'
              )}
            </button>

          <div className="delivery-info">
            <div className="info-item">
              <span className="icon">🚚</span>
              <span>Livraison offerte à partir de 100 MAD</span>
            </div>
            <div className="info-item">
              <span className="icon">⏱️</span>
              <span>1 à 3 jours ouvrables.</span>
            </div>
            <div className="info-item">
              <span className="icon">💳</span>
              <span>Paiement à la livraison disponible</span>
            </div>
            <div className="info-item">
              <span className="icon">🔒</span>
              <span>Transactions sécurisées</span>
            </div>
            <div className="info-item">
              <span className="icon">↩️</span>
              <span>Retour sans tracas sous 30 jours.</span>
            </div>
          </div>
        </div>
      </div>
    );
};
