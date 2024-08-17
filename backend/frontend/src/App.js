import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import WebFont from "webfontloader";
import store from "./store";
import { loadUser } from "./actions/userAction";
import Header from "./component/layout/Header/Header";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignUp from "./component/User/LoginSignUp";
import UserOptions from "./component/layout/Header/UserOptions";
import Profile from "./component/User/Profile";
import ProtectedRoute from "./component/Route/ProtectedRoute";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import Cart from "./component/Cart/Cart.js";
import Shipping from "./component/Cart/Shipping.js";
import ConfirmOrder from "./component/Cart/ConfirmOrder.js";
import axios from "axios";
import Payment from "./component/Cart/Payment.js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess.js";
import MyOrders from "./component/Order/MyOrders.js";
import OrderDetails from "./component/Order/OrderDetails.js";
import Dashboard from "./component/Admin/Dashboard.js";
import ProductList from "./component/Admin/ProductList.js";
import "./App.css";
import NewProduct from "./component/Admin/NewProduct.js";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList.js";
import ProcessOrder from "./component/Admin/ProcessOrder.js";
import UsersList from "./component/Admin/UsersList.js";
import UpdateUser from "./component/Admin/UpdateUser.js";
import ProductReviews from "./component/Admin/ProductReviews.js";
import Contact from "./component/layout/Contact/Contact.js";
import About from "./component/layout/About/About.js";
import NotFound from "./component/layout/Not Found/NotFound.js";
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  useEffect(() => {
    async function fetchStripeApiKey() {
      try {
        const { data } = await axios.get("/api/v1/stripeapikey");
        setStripeApiKey(data.stripeApiKey);
      } catch (error) {
        console.error("Error fetching Stripe API key:", error);
      }
    }

    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });

    store.dispatch(loadUser());
    fetchStripeApiKey();
  }, []);

  const stripePromise = stripeApiKey ? loadStripe(stripeApiKey) : null;

  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/contact" element={<Contact />}/>

        <Route path="/about" element={<About />} />
        <Route
          path="/account"
          element={<ProtectedRoute element={Profile} />}
        />
        <Route
          path="/me/update"
          element={<ProtectedRoute element={UpdateProfile} />}
        />
        <Route
          path="/password/update"
          element={<ProtectedRoute element={UpdatePassword} />}
        />
        <Route
          path="/login/shipping"
          element={<ProtectedRoute element={Shipping} />}
        />
        <Route
          path="/order/confirm"
          element={<ProtectedRoute element={ConfirmOrder} />}
        />
        <Route
          path="/process/payment"
          element={
            stripePromise ? (
              <Elements stripe={stripePromise}>
                <ProtectedRoute element={Payment} />
              </Elements>
            ) : (
              <div>Loading...</div> // or some other placeholder
            )
          }
        />
         <Route
          path="/success"
          element={<ProtectedRoute element={OrderSuccess} />}
        />
        <Route
          path="/orders"
          element={<ProtectedRoute element={MyOrders} />}
        />
        <Route
          path="/order/:id"
          element={<ProtectedRoute element={OrderDetails} />}
        />
         <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={Dashboard} />}
        />
        <Route
          path="/admin/products"
          element={<ProtectedRoute element={ProductList} />}
        />
          
        <Route
          path="/admin/product"
          element={<ProtectedRoute element={NewProduct} />}
        />
         <Route
          path="/admin/product/:id"
          element={<ProtectedRoute element={UpdateProduct} />}
        />
         <Route
          path="/admin/order/:id"
          element={<ProtectedRoute element={ProcessOrder} />}
        />
         <Route
          path="/admin/orders"
          element={<ProtectedRoute element={OrderList} />}
        />
          <Route
          path="/admin/users"
          element={<ProtectedRoute element={UsersList} />}
        />
          <Route
          path="/admin/user/:id"
          element={<ProtectedRoute element={UpdateUser} />}
        />
         <Route
          path="/admin/reviews"
          element={<ProtectedRoute element={ProductReviews} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes> 
      <Footer />
    </Router>
  );
}

export default App;
