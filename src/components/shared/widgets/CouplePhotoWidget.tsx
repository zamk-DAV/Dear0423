'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { differenceInDays } from 'date-fns';

interface CouplePhotoWidgetProps {
  imageUrl?: string;
}

export default function CouplePhotoWidget({
  imageUrl = '/placeholder-couple.jpg',
}: CouplePhotoWidgetProps) {
  const { user } = useAuthStore();

  const { data: coupleData } = useQuery({
    queryKey: ['couple', user?.couple_id],
    queryFn: async () => {
      if (!user?.couple_id) return null;
      const { data } = await supabase
        .from('couples')
        .select('d_day')
        .eq('id', user.couple_id)
        .single();
      return data;
    },
    enabled: !!user?.couple_id,
  });
  
  // D-Day 계산
  const startDate = coupleData?.d_day || '2024-01-01';
  const dDay = differenceInDays(new Date(), new Date(startDate)) + 1;

  return (
    <motion.div 
      whileTap={{ scale: 0.95 }}
      className="relative overflow-hidden rounded-3xl aspect-square bg-surface shadow-xl border border-border group cursor-pointer"
    >
      {/* 배경 사진 (Placeholder) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
      <div className="absolute inset-0 bg-surface flex items-center justify-center">
         {/* 실제 이미지는 나중에 적용 */}
         <span className="text-primary font-bold">Photo</span>
      </div>

      {/* D-Day 정보 (Overlay) */}
      <div className="absolute bottom-4 left-4 z-20 text-white">
        <p className="text-xs font-light opacity-80 uppercase tracking-widest">{user?.nickname ? `${user.nickname}와(과)` : '우리의 사랑'}</p>
        <h2 className="text-3xl font-black italic">D+{dDay}</h2>
      </div>
    </motion.div>
  );
}