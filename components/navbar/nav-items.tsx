"use client";

import { motion } from "framer-motion";

import Link from "next/link";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import LoginTrigger from "./login-trigger";
import Logo from "../logo";

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
      <div className="flex h-16 items-center justify-between">
        <Link href="/">
          <Logo hasLabel={true} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center space-x-8 md:flex">
          {navigationLinks.map((item, index) => (
            <Link
              key={`navigation-link-${index}`}
              href={item.href}
              className="text-gray-700 transition-colors hover:text-orange-500"
            >
              {item.label}
            </Link>
          ))}

          {children}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="p-2 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
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
          className="border-t border-gray-200 py-4 md:hidden"
        >
          <div className="flex flex-col space-y-4">
            <Link
              href="#features"
              className="text-gray-700 transition-colors hover:text-orange-500"
            >
              Features
            </Link>
            <Link
              href="#rentals"
              className="text-gray-700 transition-colors hover:text-orange-500"
            >
              Rentals
            </Link>
            <Link
              href="#testimonials"
              className="text-gray-700 transition-colors hover:text-orange-500"
            >
              Reviews
            </Link>
            <Link
              href="#faq"
              className="text-gray-700 transition-colors hover:text-orange-500"
            >
              FAQ
            </Link>
            <LoginTrigger />
          </div>
        </motion.div>
      )}
    </div>
  );
}
