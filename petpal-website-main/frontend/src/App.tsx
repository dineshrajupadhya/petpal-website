import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Adoption from './pages/Adoption';
import PetDetails from './pages/PetDetails';
import Store from './pages/Store';
import ProductDetails from './pages/ProductDetails';
import Diseases from './pages/Diseases';
import DiseaseDetails from './pages/DiseaseDetails';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import FloatingChatButton from './components/FloatingChatButton';
import AdoptionApplication from './pages/AdoptionApplication';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
        <main className="pt-20 pb-24">
          <Routes>

              <Route path="/" element={<Home />} />
              <Route path="/adoption" element={<Adoption />} />
              <Route path="/adoption/:id" element={<PetDetails />} />
              <Route path="/adoption-application/:id" element={<AdoptionApplication />} />

              <Route path="/store" element={<Store />} />
              <Route path="/store/:id" element={<ProductDetails />} />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />
              <Route path="/diseases" element={<Diseases />} />

              <Route path="/diseases/:id" element={<DiseaseDetails />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route 
                path="/cart" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
          <Footer />
          <FloatingChatButton />
        </div>
      </Router>
    </AppProvider>
  );

}

export default App;