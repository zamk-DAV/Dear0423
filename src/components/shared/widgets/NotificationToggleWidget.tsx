'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff } from 'lucide-react';

export default function NotificationToggleWidget() {
  const [isOn, setIsOn] = useState(true);

  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsOn(!isOn)}
      className={`relative flex items-center justify-between px-5 py-4 rounded-3xl cursor-pointer transition-colors duration-300 ${
        isOn ? 'bg-primary shadow-xl' : 'bg-surface shadow-md'
      }`}
    >
      <div className="flex items-center gap-3">
        {isOn ? (
          <Bell className="w-5 h-5 text-white animate-bounce" />
        ) : (
          <BellOff className="w-5 h-5 text-secondary" />
        )}
        <span className={`text-sm font-bold ${isOn ? 'text-white' : 'text-secondary'}`}>
          알림 {isOn ? 'ON' : 'OFF'}
        </span>
      </div>
      
      {/* 슬라이드 스위치 */}
      <div className={`w-10 h-6 flex items-center rounded-full px-1 transition-colors ${isOn ? 'bg-white/30' : 'bg-gray-300'}`}>
        <motion.div 
          animate={{ x: isOn ? 14 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </div>
    </motion.div>
  );
}
