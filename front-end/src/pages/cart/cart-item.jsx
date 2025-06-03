import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../../context/shop-context";
import { FaTrash } from "react-icons/fa";

export const CartItem = ({ id, name, price, image, size, color, jerseyType, quantity }) => {
  const { cartItems, addToCart, removeFromCart, updateCartItemCount } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const itemKey = size ? `${id}-${size}${color ? `-${color}` : ''}${jerseyType ? `-${jerseyType}` : ''}` : `${id}`;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/products/${id}?populate=*`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched product data:", data);
        if (data.data) {
          setProductData(data.data);
        } else {
          console.warn("No product data found for ID:", id);
          setFetchError(true);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setFetchError(true);
      }
    };

    fetchProductData();
  }, [id]);

  const getImageUrl = () => {
    // If we have product data from Strapi, use that first
    if (productData && !fetchError) {
      const isJersey = name.toLowerCase().includes('kits');
      
      if (isJersey) {
        // For jerseys, use jersey type to determine image
        const jerseyImages = productData.attributes.images?.data || [];
        const jerseyTypeIndex = {
          'HOME': 0,
          'AWAY': 1,
          'THIRD': 2
        }[jerseyType?.toUpperCase()] || 0;
        
        const selectedImage = jerseyImages[jerseyTypeIndex];
        if (selectedImage?.attributes?.url) {
          return `http://localhost:1337${selectedImage.attributes.url}`;
        }
      } else {
        // For shoes, find the color index in the product's colors array
        const productColors = productData.attributes.colors || [];
        const colorIndex = productColors.findIndex(c => 
          c.toLowerCase() === color?.toLowerCase()
        );
        
        const shoeImages = productData.attributes.images?.data || [];
        const selectedImage = shoeImages[colorIndex >= 0 ? colorIndex : 0];
        
        if (selectedImage?.attributes?.url) {
          return `http://localhost:1337${selectedImage.attributes.url}`;
        }
      }
    }

    // If we have an image prop, use that
    if (image?.url) {
      return `http://localhost:1337${image.url}`;
    }
    if (image?.startsWith('http')) {
      return image;
    }

    // If we have a default image in Strapi, use that
    if (productData?.attributes?.defaultImage?.data?.attributes?.url) {
      return `http://localhost:1337${productData.attributes.defaultImage.data.attributes.url}`;
    }

    // Last resort fallback - use a default image from the public folder
    return `/assets/default-product.jpg`;
  };

  // Helper function to get size display value
  const getSizeDisplay = (sizeObj) => {
    if (typeof sizeObj === 'string') return sizeObj;
    if (typeof sizeObj === 'object' && sizeObj !== null) {
      return Object.values(sizeObj).join(', ');
    }
    return '';
  };

  // Determine if this is a jersey based on the name containing "Kits"
  const isJersey = name.toLowerCase().includes('kits');
  const isAccessory = !size && !isJersey;

  console.log("CartItem rendered:", {
    id,
    name,
    price,
    size,
    color,
    jerseyType,
    quantity,
    itemKey,
    isJersey,
    isAccessory,
    productData,
    image,
    imageUrl: getImageUrl(),
    fetchError
  });

  return (
    <div className="cartItem">
      <img 
        src={getImageUrl()} 
        alt={name} 
        className="cartItem-image"
        onError={(e) => {
          console.error("Image failed to load:", e.target.src);
          if (!imageError) {
            setImageError(true);
            e.target.src = `/assets/default-product.jpg`;
          }
        }}
      />
      <div className="cartItem-description">
        <p className="cartItem-name"><b>{name}</b></p>
        <p className="cartItem-price">Price: ${price?.toFixed(2) || '0.00'}</p>
        {isJersey ? (
          <p className="cartItem-jerseyType">Type: {jerseyType}</p>
        ) : !isAccessory && (
          <>
            {size && <p className="cartItem-size">Size: {getSizeDisplay(size)}</p>}
            {color && <p className="cartItem-color">Color: {color}</p>}
          </>
        )}
        <div className="cartItem-countHandler" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => updateCartItemCount(quantity - 1, id, { size, color, jerseyType })}
            className="cartItem-quantity-btn"
            aria-label="Decrease quantity"
            title="Decrease quantity"
          > 
            - 
          </button>
          <input
            type="text"
            value={quantity || 0}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value));
              updateCartItemCount(value, id, { size, color, jerseyType });
            }}
            className="quantity-input limited-width"
            style={{ 
              textAlign: 'center',
              width: '50px',
              padding: '4px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              margin: '0 4px'
            }}
            aria-label="Item quantity"
          />
          <button 
            onClick={() => updateCartItemCount(quantity + 1, id, { size, color, jerseyType })}
            className="cartItem-quantity-btn"
            aria-label="Increase quantity"
            title="Increase quantity"
          > 
            + 
          </button>
        </div>
        <button
          className="delete-button"
          onClick={() => updateCartItemCount(0, id, { size, color, jerseyType })}
          title="Remove item from cart"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};