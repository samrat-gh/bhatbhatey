import { motion } from "framer-motion";
import { Badge, Bike, Car, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

export default function HeroSection() {
  return (
    <section className="pt-24 pb-12 lg:pt-32 lg:pb-20 bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                🎉 Now Available in Your City
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Ride your way —{" "}
                <span className="text-orange-500 relative">
                  Motorbikes & Cycles
                  <motion.div
                    className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>{" "}
                at your fingertips
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover the freedom of the road with our premium fleet of
                motorbikes and bicycles. Easy booking, affordable prices, and
                verified vehicles for your perfect ride.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Car className="h-4 w-4" />
                <span>Cars coming soon!</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                Book a Ride
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 text-lg bg-transparent transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                Explore Rides
              </Button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Instant Booking</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative">
            <div className="relative bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <Bike className="h-12 w-12 text-white mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg">
                    Motorbikes
                  </h3>
                  <p className="text-orange-100 text-sm">From ₹199/day</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <Bike className="h-12 w-12 text-white mx-auto mb-4" />
                  <h3 className="text-white font-semibold text-lg">Bicycles</h3>
                  <p className="text-orange-100 text-sm">From ₹99/day</p>
                </div>
              </div>
              <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                <Car className="h-8 w-8 text-white mx-auto mb-2" />
                <p className="text-white text-sm font-medium">
                  Cars Coming Soon!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
