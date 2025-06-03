import React, { useState, useEffect } from "react";
import { useGetProductsQuery, useGetProshirtsQuery, useGetProaccQuery } from "../../services/productService";
import { Product } from "../shop/product";
import "./search.css";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const { data: products } = useGetProductsQuery();
  const { data: shirts } = useGetProshirtsQuery();
  const { data: accessories } = useGetProaccQuery();

  useEffect(() => {
    const productsData = products?.data || [];
    const shirtsData = shirts?.data || [];
    const accessoriesData = accessories?.data || [];
    
    // Remove duplicates by using a Map with product IDs as keys
    const uniqueProducts = new Map();
    [...productsData, ...shirtsData, ...accessoriesData].forEach(product => {
      if (!uniqueProducts.has(product.id)) {
        uniqueProducts.set(product.id, product);
      }
    });
    
    const combinedProducts = Array.from(uniqueProducts.values());
    setAllProducts(combinedProducts);
    setFilteredProducts(combinedProducts);
  }, [products, shirts, accessories]);

  useEffect(() => {
    const searchResults = allProducts.filter(product =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
    setFilteredProducts(searchResults);
  }, [searchTerm, allProducts]);

  const getImageUrl = (product) => {
    if (product?.productImage?.length > 0) {
      return `http://localhost:1337${product.productImage[0].url}`;
    }
    return `/assets/products/${product.id}.jpg`;
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <div className="search-input-container"></div>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="search-trace"></div>
      </div>
      <div className="product-list">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Product
              key={product.id}
              id={product.id}
              name={product.productName}
              price={product.price}
              image={getImageUrl(product)}
            />
          ))
        ) : (
          <div className="no-results">No products found</div>
        )}
      </div>
    </div>
  );
};

export default Search;