'use client';

import { motion } from 'framer-motion';
import {
  ArrowUp,
  Award,
  Bike,
  CheckCircle,
  ChevronDown,
  Clock,
  CreditCard,
  MapPin,
  Shield,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import Footer from '../footer';
import HeroSection from './hero-section';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = [
    {
      icon: <Users className="h-8 w-8 text-orange-500" />,
      number: '50K+',
      label: 'Happy Riders',
    },
    {
      icon: <Bike className="h-8 w-8 text-orange-500" />,
      number: '500+',
      label: 'Vehicles',
    },
    {
      icon: <Award className="h-8 w-8 text-orange-500" />,
      number: '4.8',
      label: 'Rating',
    },
    {
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      number: '24/7',
      label: 'Support',
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const features = [
    {
      icon: <Clock className="h-8 w-8 text-orange-500" />,
      title: 'Easy Online Booking',
      description:
        'Book your ride in just a few clicks. Quick, simple, and hassle-free.',
    },
    {
      icon: <CreditCard className="h-8 w-8 text-orange-500" />,
      title: 'Affordable Prices',
      description:
        'Competitive rates with transparent pricing. No hidden fees, ever.',
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      title: 'Verified & Maintained',
      description:
        'All vehicles are regularly serviced and safety-checked for your peace of mind.',
    },
  ];

  const rentals = [
    {
      id: 1,
      name: 'Sport Bike',
      type: 'Motorbike',
      price: '₹499',
      period: '/day',
      image: '/sports-bike.jpg',
      rating: 4.8,
      features: ['Fuel Efficient', 'GPS Enabled', 'Helmet Included'],
    },
    {
      id: 2,
      name: 'City Cruiser',
      type: 'Bicycle',
      price: '₹299',
      period: '/day',
      image: '/bycycle.jpg',
      rating: 4.9,
      features: ['Lightweight', 'Comfortable Seat', 'Lock Included'],
    },
    {
      id: 3,
      name: 'Adventure Bike',
      type: 'Motorbike',
      price: '₹999',
      period: '/day',
      image: '/bike.webp',
      rating: 4.7,
      features: ['Off-road Ready', 'Large Tank', 'Touring Package'],
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      comment:
        'Amazing service! The bike was in perfect condition and the booking process was super smooth. Highly recommended!',
    },
    {
      name: 'Rahul Kumar',
      location: 'Delhi',
      rating: 5,
      comment:
        "Great prices and excellent customer service. I've been using BhatBhatey for months now. Never disappointed!",
    },
    {
      name: 'Sneha Patel',
      location: 'Bangalore',
      rating: 4,
      comment:
        'Love the variety of bikes available. The app is user-friendly and the vehicles are always clean and well-maintained.',
    },
  ];

  const faqs = [
    {
      question: 'How do I book a vehicle?',
      answer:
        "Simply browse our available vehicles, select your preferred dates, and complete the booking through our secure payment system. You'll receive instant confirmation.",
    },
    {
      question: 'What documents do I need?',
      answer:
        "You'll need a valid driving license, government-issued ID proof, and a security deposit. All documents can be uploaded during the booking process.",
    },
    {
      question: 'Is fuel included in the rental?',
      answer:
        "Vehicles are provided with a full tank. You're responsible for refueling before return. We also offer fuel packages for added convenience.",
    },
    {
      question: 'What if I face issues during my ride?',
      answer:
        'We provide 24/7 roadside assistance. Simply call our support number, and our team will help you resolve any issues quickly.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center group"
              >
                <div className="mb-4 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm lg:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BhatBhatey?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make vehicle rental simple, affordable, and reliable.
              Here&apos;s what sets us apart.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Rentals Section */}
      <section id="rentals" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Popular Rentals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our most loved vehicles. All maintained to perfection
              and ready for your adventure.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {rentals.map((rental) => (
              <motion.div key={rental.id} variants={fadeInUp}>
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group">
                  <div className="relative overflow-hidden">
                    <Image
                      src={rental.image || '/placeholder.svg'}
                      alt={rental.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-orange-500 text-white">
                      {rental.type}
                    </Badge>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {rental.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {rental.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-500">
                          {rental.price}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rental.period}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-6">
                      {rental.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-sm text-gray-600"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105 transition-all duration-200 group">
                      <span className="group-hover:mr-2 transition-all duration-200">
                        Book Now
                      </span>
                      <ArrowUp className="h-4 w-4 rotate-45 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Riders Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our
              satisfied customers have to say.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {`"${testimonial.comment}"`}
                    </p>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied riders who trust BhatBhatey for their
              daily commute and adventures. Book your perfect ride today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold transform hover:scale-105 transition-all duration-200"
              >
                Book Your Ride Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 text-lg font-semibold bg-transparent transform hover:scale-105 transition-all duration-200"
              >
                Download App
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Got questions? We&apos;ve got answers. Here are the most common
              questions about our service.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto space-y-4"
          >
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-0">
                  <button
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <span className="font-semibold text-gray-900 text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3">
        {/* Quick Book Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          className="relative"
        >
          <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 group relative z-10">
            <Bike className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
          </Button>
          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 bg-orange-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Scroll to Top Button */}
        {showScrollToTop && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            <Button
              onClick={scrollToTop}
              variant="outline"
              className="bg-white hover:bg-gray-50 text-gray-700 rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-300 border-gray-200"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
