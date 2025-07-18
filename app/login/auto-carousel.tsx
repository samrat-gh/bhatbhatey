"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const carouselImages = [
  {
    src: "/placeholder.svg?height=600&width=400",
    alt: "Delicious Indian cuisine",
    title: "Authentic Flavors",
  },
  {
    src: "/placeholder.svg?height=600&width=400",
    alt: "Fresh ingredients",
    title: "Fresh Ingredients",
  },
  {
    src: "/placeholder.svg?height=600&width=400",
    alt: "Traditional cooking",
    title: "Traditional Recipes",
  },
  {
    src: "/placeholder.svg?height=600&width=400",
    alt: "Happy customers",
    title: "Happy Customers",
  },
  {
    src: "/placeholder.svg?height=600&width=400",
    alt: "Restaurant ambiance",
    title: "Great Ambiance",
  },
];

export function AutoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/50 to-transparent z-10" />

      {/* Carousel images */}
      <div className="relative h-full w-full">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-in-out",
              index === currentIndex ? "opacity-100" : "opacity-0"
            )}>
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-8 left-8 z-20">
              <h3 className="text-2xl font-bold text-white mb-2">
                {image.title}
              </h3>
              <p className="text-orange-100 text-sm">
                Experience the best of Indian cuisine
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            )}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Bhatbhatey branding overlay */}
      <div className="absolute top-8 left-8 z-20">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
          <h2 className="text-white font-bold text-lg">Bhatbhatey</h2>
          <p className="text-orange-100 text-xs">Taste of Tradition</p>
        </div>
      </div>
    </div>
  );
}
