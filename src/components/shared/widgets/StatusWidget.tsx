'use client';

import { motion } from 'framer-motion';

interface StatusWidgetProps {
  partnerName?: string;
  isOnline?: boolean;
}

export default function StatusWidget({
  partnerName = '사랑하는 사람',
  isOnline = true
}: StatusWidgetProps) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="flex items-center px-5 py-4 rounded-3xl bg-white shadow-md border border-gray-50 gap-4"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          {/* 프로필 이미지 Placeholder */}
          <span className="text-[10px] text-secondary">Profile</span>
        </div>
        {/* 온라인 인디케이터 */}
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-primary border-2 border-white rounded-full animate-pulse" />
        )}
      </div>
      
      <div className="flex flex-col">
        <span className="text-sm font-bold text-primary">{partnerName}</span>
        <span className="text-[11px] text-secondary">
          {isOnline ? '지금 Dear 보는 중' : '잠시 외출 중'}
        </span>
      </div>
    </motion.div>
  );
}
