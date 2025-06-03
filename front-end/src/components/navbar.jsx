import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "phosphor-react";
import { FaAddressBook } from "react-icons/fa";
import { CiUser, CiSearch } from "react-icons/ci";
import { ShopContext } from "../context/shop-context"; // Updated import path
import "./navbar.css";

export const Navbar = () => {
  const { cartItems } = useContext(ShopContext); // Access cartItems from context

  // Calculate total items in cart
  const totalItemsInCart = Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div>
      <nav className="section__container nav__container">
        <Link to="/" className="nav__logo">YOU ZEX</Link>
        <ul className="nav__links">
          <li className="link"><Link to="/">HOME</Link></li>
          <li className="link"><Link to="/shop">SHOES</Link></li>
          <li className="link"><Link to="/shirts">SHIRTS</Link></li>
          <li className="link"><Link to="/accessories">ACCESSORIES</Link></li>
        </ul>
        <div className="nav__icons">
          <Link to="/search">
            <span><CiSearch size={32} /></span>
          </Link>
          <Link to="/signin">
            <span><CiUser size={32} /></span>
          </Link>
          <Link to="/cart" className="relative">
            <span><ShoppingCart size={32} /></span>
            {totalItemsInCart > 0 && (
              <span className="cart-badge">{totalItemsInCart}</span>
            )}
          </Link>
        </div>
      </nav>
    </div>
  );
};
