'use client';

import { motion } from 'framer-motion';
import { MessageSquare, Heart, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getRecentFeeds } from '@/lib/actions/notion';

export default function FeedPreviewWidget() {
  const { data: feeds, isLoading } = useQuery({
    queryKey: ['recentFeeds'],
    queryFn: () => getRecentFeeds(1), // 1개만 가져옴
  });

  const latest = feeds?.[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-5 rounded-3xl bg-white shadow-lg border border-border aspect-square">
        <Loader2 className="w-6 h-6 animate-spin text-secondary" />
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-white shadow-lg border border-border aspect-square gap-2">
        <span className="text-2xl">📝</span>
        <p className="text-xs text-secondary">작성된 글이 없어요</p>
      </div>
    );
  }

  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="flex flex-col p-5 rounded-3xl bg-white shadow-lg border border-border gap-3 aspect-square justify-between"
    >
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="text-[11px] font-black text-primary uppercase tracking-tighter">Recent Feed</span>
        <span className="text-[10px] text-secondary">{latest.date.split('T')[0]}</span>
      </div>
      
      <p className="text-sm text-primary leading-relaxed line-clamp-3 font-medium">
        {latest.preview || latest.title}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-2">
        <span className="text-[11px] font-bold text-secondary truncate max-w-[60px]">by {latest.writer}</span>
        <div className="flex gap-2">
          <div className="flex items-center gap-0.5">
            <Heart className={`w-3 h-3 ${latest.likes ? 'text-primary fill-primary' : 'text-secondary'}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
