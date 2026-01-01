'use client';

import { useState } from 'react';
import Link from 'next/link';
import WidgetGrid from '@/components/shared/WidgetGrid';
import { Settings, PlusSquare } from 'lucide-react';
import WriteModal from '@/components/shared/WriteModal';

export default function MobileHome() {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* 상단 헤더 (앱 바) */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-sm border-b border-border">
        <h1 className="text-2xl font-serif italic text-primary font-bold tracking-tighter">Dear</h1>
        <div className="flex items-center gap-3">
          <Link href="/settings" className="text-secondary hover:text-primary transition-colors">
            <Settings className="w-6 h-6" />
          </Link>
          <div className="w-8 h-8 rounded-full bg-surface border border-border overflow-hidden">
             {/* 내 프로필 이미지 */}
          </div>
        </div>
      </header>

      {/* 위젯 영역 (드래그 가능) */}
      <div className="pt-2">
        <WidgetGrid />
      </div>

      {/* 하단 탭바 (Bottom Navigation) */}
      <nav className="fixed bottom-0 w-full bg-background border-t border-border flex justify-around py-3 pb-5 z-50 items-end">
        <button className="flex flex-col items-center gap-1 text-primary">
          <span className="text-xs font-bold">홈</span>
        </button>
        
        {/* 중앙 글쓰기 버튼 (강조) */}
        <button 
          onClick={() => setIsWriteModalOpen(true)}
          className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition-colors -mt-4"
        >
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg transform active:scale-95 transition-all">
            <PlusSquare className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium mt-1">기록</span>
        </button>

        <Link href="/chat" className="flex flex-col items-center gap-1 text-secondary hover:text-primary transition-colors">
          <span className="text-xs font-medium">채팅</span>
        </Link>
      </nav>

      {/* 글쓰기 모달 */}
      <WriteModal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)} />
    </main>
  );
}