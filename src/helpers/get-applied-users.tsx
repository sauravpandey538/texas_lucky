"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AnimatedUserCount = ({ participants }: { participants: number }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    // Reset animation when participants change
    const startValue = displayCount;
    const endValue = participants;
    const duration = 100; // 1 second animation
    const frames = 60; // 60 frames per second
    const step = (endValue - startValue) / frames;

    let currentFrame = 0;

    const animate = setInterval(() => {
      currentFrame++;
      const newCount = Math.round(startValue + step * currentFrame);

      if (currentFrame >= frames) {
        setDisplayCount(endValue);
        clearInterval(animate);
      } else {
        setDisplayCount(newCount);
      }
    }, duration / frames);

    return () => clearInterval(animate);
  }, [participants]); // Only depend on participants prop

  return (
    <div className="flex gap-3 items-center justify-center p-4">
      <h2 className="text-sm font-semibold">Total Applied User Count : </h2>
      <motion.div
        className="text-2xl font-semibold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {displayCount}
      </motion.div>
    </div>
  );
};

export default AnimatedUserCount;
