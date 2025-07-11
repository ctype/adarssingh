import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroPage from './pages/HeroPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import EDAApp from './components/EDAApp';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Provider store={store}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HeroPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route 
              path="/app" 
              element={
                <>
                  <SignedIn>
                    <EDAApp />
                  </SignedIn>
                  <SignedOut>
                    <AuthPage />
                  </SignedOut>
                </>
              } 
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Provider>
  );
}

export default App;