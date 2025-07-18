"use client";

import { motion } from "framer-motion";

import Link from "next/link";

import { useState } from "react";
import { Bike, Menu, X } from "lucide-react";
import LoginTrigger from "./login-trigger";

export default function NavItems({ children }: { children?: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationLinks = [
    // { href: "#", label: "Home", active: true },
    { href: "#", label: "Features" },
    { href: "#", label: "Rentals" },
    { href: "#", label: "Reviews" },
    { href: "#", label: "FAQ" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2">
          <div className="bg-orange-500 p-2 rounded-lg">
            <Bike className="h-6 w-6 text-white" />
          </div>
          {/* <Logo /> */}
          <span className="text-2xl font-bold text-gray-900">BhatBhatey</span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navigationLinks.map((item, index) => (
            <Link
              key={`navigation-link-${index}`}
              href={item.href}
              className="text-gray-700 hover:text-orange-500 transition-colors">
              {item.label}
            </Link>
          ))}

          {children}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden py-4 border-t border-gray-200">
          <div className="flex flex-col space-y-4">
            <Link
              href="#features"
              className="text-gray-700 hover:text-orange-500 transition-colors">
              Features
            </Link>
            <Link
              href="#rentals"
              className="text-gray-700 hover:text-orange-500 transition-colors">
              Rentals
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-700 hover:text-orange-500 transition-colors">
              Reviews
            </Link>
            <Link
              href="#faq"
              className="text-gray-700 hover:text-orange-500 transition-colors">
              FAQ
            </Link>
            <LoginTrigger />
          </div>
        </motion.div>
      )}
    </div>
  );
}
