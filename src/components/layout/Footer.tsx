import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Description */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">College<span className="text-accent">Connect</span></span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              The premier marketplace for college students to buy, sell, and exchange items within their campus community.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-400 transition-colors hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 transition-colors hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 transition-colors hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/listings" className="text-gray-400 transition-colors hover:text-white">Browse Listings</Link>
              </li>
              <li>
                <Link to="/listings/create" className="text-gray-400 transition-colors hover:text-white">Sell an Item</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 transition-colors hover:text-white">Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/listings?category=textbooks" className="text-gray-400 transition-colors hover:text-white">Textbooks</Link>
              </li>
              <li>
                <Link to="/listings?category=electronics" className="text-gray-400 transition-colors hover:text-white">Electronics</Link>
              </li>
              <li>
                <Link to="/listings?category=furniture" className="text-gray-400 transition-colors hover:text-white">Furniture</Link>
              </li>
              <li>
                <Link to="/listings?category=clothing" className="text-gray-400 transition-colors hover:text-white">Clothing</Link>
              </li>
              <li>
                <Link to="/listings?category=services" className="text-gray-400 transition-colors hover:text-white">Services</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="mr-2 mt-0.5 h-5 w-5 text-gray-400" />
                <span className="text-gray-400">support@collegeconnect.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="mr-2 mt-0.5 h-5 w-5 text-gray-400" />
                <span className="text-gray-400">(123) 456-7890</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} CollegeConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;