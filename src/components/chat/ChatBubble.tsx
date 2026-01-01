'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Image from 'next/image';
import ChatMessageMenu from './ChatMessageMenu';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ChatBubbleProps {
  id: string;
  content: string;
  type?: 'text' | 'image';
  isMine: boolean;
  timestamp: string;
  isRead?: boolean;
}

export default function ChatBubble({ id, content, type = 'text', isMine, timestamp, isRead = false }: ChatBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    // 이미지일 때는 롱 프레스로 메뉴 띄우기보다 확대 보기를 우선시할 수 있음.
    // 하지만 여기선 메뉴도 가능하게 유지.
    const touch = e.touches[0];
    timerRef.current = setTimeout(() => {
      setMenuPos({ x: touch.clientX, y: touch.clientY });
      setShowMenu(true);
    }, 500); 
  };

  const handleTouchEnd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={`flex w-full mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}
      >
        <div className={`flex max-w-[75%] ${isMine ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
          {/* 상대방 프로필 */}
          {!isMine && (
            <div className="w-8 h-8 rounded-full bg-surface border border-border flex-shrink-0 mb-4 overflow-hidden shadow-sm" />
          )}

          {/* 말풍선 본체 */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onContextMenu={handleContextMenu}
            className={`
              relative shadow-sm transition-transform active:scale-95 cursor-pointer
              ${type === 'text' ? 'px-4 py-3 text-[15px] leading-relaxed' : 'p-1 rounded-2xl overflow-hidden'}
              ${isMine 
                ? 'bg-primary text-white rounded-l-2xl rounded-tr-2xl rounded-br-sm' 
                : 'bg-white text-primary rounded-r-2xl rounded-tl-2xl rounded-bl-sm border border-border'}
            `}
          >
            {type === 'image' ? (
              <div className="relative w-48 h-48 sm:w-64 sm:h-64" onClick={(e) => e.stopPropagation()}>
                <Zoom>
                  <Image src={content} alt="Sent image" fill className="object-cover rounded-xl" />
                </Zoom>
              </div>
            ) : (
              content
            )}
          </div>

          {/* 시간 및 읽음 표시 */}
          <div className="flex flex-col gap-0.5 text-[10px] text-secondary mb-1 flex-shrink-0 min-w-[30px]">
            {!isRead && isMine && <span className="text-primary font-bold self-end text-[9px]">1</span>}
            <span className="self-end">{format(new Date(timestamp), 'HH:mm')}</span>
          </div>
        </div>
      </motion.div>

      <ChatMessageMenu 
        isOpen={showMenu} 
        onClose={() => setShowMenu(false)} 
        messageId={id}
        content={content}
        isMine={isMine}
        position={menuPos}
      />
    </>
  );
}
