import { Bike, Facebook, Instagram, Mail, Phone, Twitter } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-orange-500 p-2 rounded-lg">
                <Bike className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">BhatBhatey</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for motorbike and bicycle rentals. Ride your
              way with confidence and convenience.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="#features"
                className="block text-gray-400 hover:text-orange-500 transition-colors"
              >
                Features
              </Link>
              <Link
                href="#rentals"
                className="block text-gray-400 hover:text-orange-500 transition-colors"
              >
                Rentals
              </Link>
              <Link
                href="#testimonials"
                className="block text-gray-400 hover:text-orange-500 transition-colors"
              >
                Reviews
              </Link>
              <Link
                href="#faq"
                className="block text-gray-400 hover:text-orange-500 transition-colors"
              >
                FAQ
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link
                href="#"
                className="block text-gray-400 hover:text-orange-500 transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="#"
                className="block text-gray-400 hover:text-orange-500 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="block text-gray-400 hover:text-orange-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="block text-gray-400 hover:text-orange-500 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-500" />
                <span className="text-gray-400">support@bhatbhatey.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500" />
                <span className="text-gray-400">+91 98765 43210</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} BhatBhatey. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
