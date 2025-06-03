import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { Shop } from "./pages/shop/shop";
import { Cart } from "./pages/cart/cart";
import { ShopContextProvider } from "./context/shop-context";
import Home from "./components/HOME";
import { Shirts } from "./components/Shirts";
import { Accessories } from "./components/Accessories";
import Search from "./pages/search/Search";
import Auth from "./pages/auth/Auth";
import PaymentForm from './pages/payment/PaymentForm';
import { ProductDetail } from "./pages/shop/ProductDetail";

function App() {
  return (
    <BrowserRouter>
      <ShopContextProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/signin" element={<Auth />} />
          <Route path="/signup" element={<Auth />} />
          <Route path="/shirts" element={<Shirts />} />
          <Route path="/accessories" element={<Accessories />} />
          <Route path="/search" element={<Search />} />
          <Route path="/payment" element={<PaymentForm />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </ShopContextProvider>
    </BrowserRouter>
  );
}

export default App;