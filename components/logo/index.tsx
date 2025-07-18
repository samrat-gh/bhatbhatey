"use client";

import { motion } from "framer-motion";
import { Bike } from "lucide-react";
import { FlipText } from "../magicui/flip-text";

interface LogoProps {
  hasLabel?: boolean;
}

export default function Logo({ hasLabel = false }: LogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group flex items-center space-x-2"
    >
      <div className="rounded-lg bg-orange-500 p-2 transition-transform duration-200 group-hover:scale-115">
        <Bike className="h-6 w-6 text-white" />
      </div>
      {hasLabel && (
        <span className="inline text-2xl font-bold text-gray-900 group-hover:hidden">
          BhatBhatey
        </span>
      )}
      <FlipText className="hidden font-bold -tracking-widest text-black group-hover:block">
        Flip Text
      </FlipText>
    </motion.div>
  );
}
