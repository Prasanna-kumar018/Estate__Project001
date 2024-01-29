import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import About from "./pages/About";
import Sign_Up from "./pages/Sign_Up";
import Sign_in from "./pages/Sign_in";
import ProtectedPage from "./pages/ProtectedPage";
import Profile from "./pages/Profile"; 
import Create_listing from "./pages/create_listing";
import Listing_Page from "./pages/Listing_Page";
import EditListing from "./pages/EditListing";
import Search from "./pages/Search";
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<Sign_in />} />
        <Route path="/sign-up" element={<Sign_Up />} />
        <Route element={<ProtectedPage />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<Create_listing />} />
          <Route path="/listing/:list_id" element={<Listing_Page />} />
          <Route path="/edit_listing/:edit_list_id" element={<EditListing />} />
          <Route path="/search" element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
