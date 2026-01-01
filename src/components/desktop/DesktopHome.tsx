'use client';

import { useState } from 'react';
import WidgetGrid from '@/components/shared/WidgetGrid';
import Link from 'next/link';
import WriteModal from '@/components/shared/WriteModal';

export default function DesktopHome() {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  return (
    // 전체 컨테이너: 화면 높이 꽉 채움, Flex Row 배치
    <div className="flex h-screen w-full bg-background overflow-hidden">
      
      {/* 1. 좌측 사이드바: 고정 너비, 스크롤 없음 */}
      <aside className="w-72 flex-none border-r border-border bg-surface flex flex-col p-8 z-20">
        <h1 className="text-4xl font-serif italic text-primary font-bold mb-12 tracking-tighter cursor-default">Dear</h1>
        
        <nav className="flex flex-col gap-4 space-y-2 flex-1">
          <Link href="/" className="text-left text-lg font-bold text-primary transition-colors py-2">🏠 홈</Link>
          <Link href="/chat" className="text-left text-lg font-medium text-secondary hover:text-primary transition-colors py-2">💬 채팅</Link>
          <button className="text-left text-lg font-medium text-secondary hover:text-primary transition-colors py-2">📖 다이어리</button>
          <Link href="/settings" className="text-left text-lg font-medium text-secondary hover:text-primary transition-colors py-2">⚙️ 설정</Link>
        </nav>

        <div className="mt-auto pt-8 border-t border-border/50">
          <p className="text-xs text-secondary/50">© 2024 Dear App</p>
        </div>
      </aside>

      {/* 2. 메인 콘텐츠: 남은 공간 모두 차지 (flex-1), 내부 스크롤 */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto bg-background">
        <div className="flex-1 p-8 lg:p-16 max-w-7xl mx-auto w-full">
          {/* 헤더 영역 */}
          <header className="mb-12 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-bold text-primary mb-2">우리의 공간</h2>
              <p className="text-lg text-secondary">오늘도 사랑스러운 하루 보내세요!</p>
            </div>
            <div className="flex gap-3">
               <button 
                 onClick={() => setIsWriteModalOpen(true)}
                 className="px-6 py-3 bg-primary text-white rounded-2xl shadow-lg hover:bg-black/90 transition-transform active:scale-95 font-medium flex items-center gap-2"
               >
                 <span>✏️</span>
                 <span>글쓰기</span>
               </button>
            </div>
          </header>
          
          {/* 위젯 그리드 탑재 */}
          <div className="w-full">
            <WidgetGrid />
          </div>
        </div>
        
        {/* 글쓰기 모달 */}
        <WriteModal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)} />
      </main>
    </div>
  );
}
