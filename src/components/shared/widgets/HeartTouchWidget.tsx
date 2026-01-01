'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function HeartTouchWidget() {
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  const addHeart = (e: React.MouseEvent | React.TouchEvent) => {
    const id = Date.now();
    setHearts((prev) => [...prev, { id, x: 0, y: 0 }]); // 단순화된 파티클 위치
    
    // 1초 뒤 하트 제거
    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1000);
  };

  return (
    <motion.div 
      whileTap={{ scale: 0.9 }}
      onClick={addHeart}
      className="relative flex items-center justify-center rounded-3xl aspect-square bg-white shadow-lg border border-border cursor-pointer overflow-hidden"
    >
      <Heart className="w-12 h-12 text-primary fill-primary" />
      
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -100, opacity: 0, scale: 1.5 }}
            exit={{ opacity: 0 }}
            className="absolute z-50 pointer-events-none"
          >
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </motion.div>
        ))}
      </AnimatePresence>
      
      <div className="absolute bottom-3 text-[10px] text-secondary font-medium">TAP ME</div>
    </motion.div>
  );
}
