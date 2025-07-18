import { motion } from "framer-motion";
import { Bike, Car, CheckCircle } from "lucide-react";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-white pt-24 pb-12 lg:pt-32 lg:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                🎉 Now Available in Your City
              </Badge>
              <h1 className="text-4xl leading-tight font-bold text-gray-900 lg:text-6xl">
                Ride your way —{" "}
                <span className="relative text-orange-500">
                  Motorbikes & Cycles
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 w-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  />
                </span>{" "}
                at your fingertips
              </h1>
              <p className="text-xl leading-relaxed text-gray-600">
                Discover the freedom of the road with our premium fleet of
                motorbikes and bicycles. Easy booking, affordable prices, and
                verified vehicles for your perfect ride.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Car className="h-4 w-4" />
                <span>Cars coming soon!</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                className="transform bg-orange-500 px-8 py-3 text-lg text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-orange-600 hover:shadow-xl"
              >
                Book a Ride
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="transform border-orange-500 bg-transparent px-8 py-3 text-lg text-orange-500 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-orange-50 hover:shadow-xl"
              >
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
            className="relative"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-orange-400 to-orange-600 p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl bg-white/20 p-6 text-center backdrop-blur-sm">
                  <Bike className="mx-auto mb-4 h-12 w-12 text-white" />
                  <h3 className="text-lg font-semibold text-white">
                    Motorbikes
                  </h3>
                  <p className="text-sm text-orange-100">From ₹199/day</p>
                </div>
                <div className="rounded-2xl bg-white/20 p-6 text-center backdrop-blur-sm">
                  <Bike className="mx-auto mb-4 h-12 w-12 text-white" />
                  <h3 className="text-lg font-semibold text-white">Bicycles</h3>
                  <p className="text-sm text-orange-100">From ₹99/day</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl bg-white/10 p-4 text-center backdrop-blur-sm">
                <Car className="mx-auto mb-2 h-8 w-8 text-white" />
                <p className="text-sm font-medium text-white">
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
