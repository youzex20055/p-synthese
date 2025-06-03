import { createContext, useState, useEffect } from "react";

export const ShopContext = createContext(null);

export const ShopContextProvider = (props) => {
  // Function to determine if an item is a jersey based on its ID
  const isJerseyItem = (itemId) => {
    // Updated logic to identify jersey items
    // Jerseys have IDs 68-70 and 75-77
    const id = parseInt(itemId);
    return (id >= 68 && id <= 70) || (id >= 75 && id <= 77);
  };

  // Function to create consistent cart key
  const createCartKey = (itemId, attributes = {}) => {
    const { size, color, jerseyType } = attributes;
    const isJersey = isJerseyItem(itemId);
    // For jerseys, always include the jersey type and default to HOME if not provided
    if (isJersey) {
      const type = jerseyType || 'HOME';
      return `${itemId}_${size || ''}_${color || ''}_${type}`;
    }
    // For non-jerseys, only include attributes that have values
    return `${itemId}${size ? `_${size}` : ''}${color ? `_${color}` : ''}`;
  };

  // Function to migrate old cart format to new format
  const migrateCartData = (oldCart) => {
    const newCart = {};
    Object.entries(oldCart).forEach(([key, item]) => {
      const [itemId] = key.split('_');
      const isJersey = isJerseyItem(parseInt(itemId));
      
      // For jerseys, ensure there's a jersey type
      const newItem = {
        ...item,
        jerseyType: isJersey ? (item.jerseyType || 'HOME') : '',
        color: isJersey ? '' : (item.color || ''),
        colorArray: !isJersey ? (item.colorArray || []) : [],
        selectedColorIndex: !isJersey ? (item.selectedColorIndex || -1) : -1
      };

      // Create new key with consistent format
      const newKey = createCartKey(itemId, newItem);
      newCart[newKey] = newItem;
    });
    return newCart;
  };

  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Migrate old cart data to new format
        const migratedCart = migrateCartData(parsedCart);
        // Save migrated cart back to localStorage
        localStorage.setItem("cart", JSON.stringify(migratedCart));
        return migratedCart;
      }
      return {};
    } catch (e) {
      console.error("Error loading cart:", e);
      return {};
    }
  });

  const addToCart = (itemId, attributes = {}) => {
    console.log('Adding to cart:', { itemId, attributes, isJersey: isJerseyItem(itemId) });
    setCartItems((prev) => {
      const isJersey = isJerseyItem(itemId);
      const itemAttributes = {
        ...attributes,
        jerseyType: isJersey ? (attributes.jerseyType || 'HOME') : '',
        color: isJersey ? '' : attributes.color,
        colorArray: !isJersey ? (attributes.colorArray || []) : [],
        selectedColorIndex: !isJersey ? (attributes.selectedColorIndex || -1) : -1
      };
      
      const cartKey = createCartKey(itemId, itemAttributes);
      console.log('Cart key:', cartKey);
      const updatedCart = { 
        ...prev,
        [cartKey]: {
          quantity: (prev[cartKey]?.quantity || 0) + 1,
          size: itemAttributes.size || '',
          color: itemAttributes.color || '',
          jerseyType: isJersey ? (itemAttributes.jerseyType || 'HOME') : '',
          colorArray: !isJersey ? (itemAttributes.colorArray || []) : [],
          selectedColorIndex: !isJersey ? (itemAttributes.selectedColorIndex || -1) : -1
        }
      };
      console.log('Updated cart:', updatedCart);
      try {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (e) {
        console.error("Error saving cart:", e);
      }
      return updatedCart;
    });
  };

  const removeFromCart = (itemId, attributes = {}) => {
    setCartItems((prev) => {
      const isJersey = isJerseyItem(itemId);
      const itemAttributes = {
        ...attributes,
        jerseyType: isJersey ? (attributes.jerseyType || 'HOME') : '',
        color: isJersey ? '' : attributes.color,
        colorArray: !isJersey ? (attributes.colorArray || []) : [],
        selectedColorIndex: !isJersey ? (attributes.selectedColorIndex || -1) : -1
      };
      
      const cartKey = createCartKey(itemId, itemAttributes);
      const updatedCart = { ...prev };
      delete updatedCart[cartKey];
      try {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (e) {
        console.error("Error saving cart:", e);
      }
      return updatedCart;
    });
  };

  const updateCartItemCount = (newAmount, itemId, attributes = {}) => {
    setCartItems((prev) => {
      const isJersey = isJerseyItem(itemId);
      const itemAttributes = {
        ...attributes,
        jerseyType: isJersey ? (attributes.jerseyType || 'HOME') : '',
        color: isJersey ? '' : attributes.color,
        colorArray: !isJersey ? (attributes.colorArray || []) : [],
        selectedColorIndex: !isJersey ? (attributes.selectedColorIndex || -1) : -1
      };
      
      const cartKey = createCartKey(itemId, itemAttributes);
      const updatedCart = {
        ...prev,
        [cartKey]: {
          quantity: newAmount,
          size: itemAttributes.size || '',
          color: itemAttributes.color || '',
          jerseyType: isJersey ? (itemAttributes.jerseyType || 'HOME') : '',
          colorArray: !isJersey ? (itemAttributes.colorArray || []) : [],
          selectedColorIndex: !isJersey ? (itemAttributes.selectedColorIndex || -1) : -1
        }
      };
      try {
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } catch (e) {
        console.error("Error saving cart:", e);
      }
      return updatedCart;
    });
  };

  // Clear cart function
  const clearCart = () => {
    setCartItems({});
    try {
      localStorage.setItem("cart", "{}");
    } catch (e) {
      console.error("Error clearing cart:", e);
    }
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemCount,
    setCartItems,
    clearCart,
    isJerseyItem // Export this function so other components can use it
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
