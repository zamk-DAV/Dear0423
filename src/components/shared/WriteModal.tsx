'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { createFeed } from '@/lib/actions/notion';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface WriteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WriteModal({ isOpen, onClose }: WriteModalProps) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // 임시: URL 입력 방식 (추후 파일 업로드로 고도화)
  const queryClient = useQueryClient();

  // React Query Mutation (낙관적 업데이트 포함)
  const mutation = useMutation({
    mutationFn: async () => {
      await createFeed(content, imageUrl);
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['recentFeeds'] });
      const previousFeeds = queryClient.getQueryData(['recentFeeds']);

      // 가짜 데이터를 먼저 화면에 뿌림
      queryClient.setQueryData(['recentFeeds'], (old: any) => [
        {
          id: 'temp-' + Date.now(),
          title: content.slice(0, 20),
          preview: content,
          imageUrl: imageUrl,
          date: new Date().toISOString(),
          writer: 'Me',
          likes: 0,
        },
        ...(old || []),
      ]);

      return { previousFeeds };
    },
    onError: (err, newTodo, context) => {
      // 에러 나면 롤백
      queryClient.setQueryData(['recentFeeds'], context?.previousFeeds);
      alert('글 작성 실패: ' + err.message);
    },
    onSettled: () => {
      // 성공하든 실패하든 최신 데이터로 동기화
      queryClient.invalidateQueries({ queryKey: ['recentFeeds'] });
      onClose();
      setContent('');
      setImageUrl('');
    },
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 (Dimmed) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />
          
          {/* 모달 창 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 z-50 max-w-lg mx-auto h-[80vh] flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <button onClick={onClose} className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-bold text-black">새 글 쓰기</h2>
              <button 
                onClick={() => mutation.mutate()}
                disabled={!content.trim() || mutation.isPending}
                className="text-sm font-bold text-white bg-black px-4 py-2 rounded-full disabled:opacity-50 hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                {mutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                등록
              </button>
            </div>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="오늘 무슨 일이 있었나요?"
              className="w-full flex-1 resize-none outline-none text-lg leading-relaxed placeholder:text-gray-300"
            />

            <div className="border-t border-gray-100 pt-4 mt-auto flex items-center gap-4">
              <button className="p-3 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
                <ImageIcon className="w-6 h-6" />
              </button>
              {/* 이미지 URL 입력 (임시) */}
              <input 
                type="text" 
                placeholder="이미지 URL (선택)" 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 bg-gray-50 px-4 py-3 rounded-xl text-sm outline-none"
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
