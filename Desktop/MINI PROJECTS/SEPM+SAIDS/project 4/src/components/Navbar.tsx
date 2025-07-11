import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Menu, X, LogIn } from 'lucide-react';
import mypic from '../../assets/logo2.jpg'; // Assuming this is your logo image path

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-xl font-bold text-gray-900 no-underline"
        >
          {/* Using the imported image for the logo */}
          <img
            src={mypic}
            alt="NoStatsSherlock Logo"
            className="h-7 w-7 rounded-md object-cover" // Added object-cover for better image fitting
          />
          NoStatsSherlock
        </Link>

        {/* Desktop Navigation & Auth Section */}
        <div className="hidden items-center gap-8 md:flex">
          {/* Nav Links */}
          <div className="flex gap-6">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative py-2 text-sm font-medium no-underline transition duration-200 ease-in-out
                  ${isActive(item.path)
                    ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            <SignedOut>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white no-underline transition duration-200 ease-in-out hover:bg-blue-700"
              >
                <LogIn size={16} />
                Sign In
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                to="/app"
                className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white no-underline transition duration-200 ease-in-out hover:bg-emerald-600"
              >
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* Mobile Menu Button (visible on small screens) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="block p-2 text-gray-700 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu (conditionally rendered) */}
      {isMenuOpen && (
        <div className="block border-t border-gray-200 bg-white pb-4 pt-2 md:hidden">
          <div className="flex flex-col px-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block border-b border-gray-100 py-3 text-base no-underline
                  ${isActive(item.path) ? 'font-semibold text-blue-600' : 'font-medium text-gray-700 hover:text-gray-900'}
                `}
              >
                {item.label}
              </Link>
            ))}
            {/* Mobile Auth Links */}
            <div className="mt-4 flex flex-col gap-3">
              <SignedOut>
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-3 text-base font-medium text-white no-underline transition duration-200 ease-in-out hover:bg-blue-700"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/app"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-md bg-emerald-500 px-4 py-3 text-base font-medium text-white no-underline transition duration-200 ease-in-out hover:bg-emerald-600"
                >
                  Dashboard
                </Link>
                <div className="flex justify-center py-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
