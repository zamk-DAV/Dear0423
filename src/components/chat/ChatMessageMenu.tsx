'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Smile } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ChatMessageMenuProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
  content: string;
  isMine: boolean;
  position: { x: number; y: number };
}

export default function ChatMessageMenu({ isOpen, onClose, messageId, content, isMine, position }: ChatMessageMenuProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까? (상대방에게서도 삭제됩니다)')) return;
    
    await supabase.from('messages').delete().eq('id', messageId);
    onClose();
  };

  // 화면 밖으로 나가는 것 방지
  const adjustedY = position.y > window.innerHeight - 150 ? position.y - 120 : position.y;
  const adjustedX = position.x > window.innerWidth - 150 ? position.x - 100 : position.x;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{ top: adjustedY, left: adjustedX }}
            className="fixed z-50 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-border p-2 min-w-[140px] flex flex-col gap-1"
          >
            <button onClick={handleCopy} className="flex items-center gap-3 px-3 py-2.5 text-sm text-primary hover:bg-surface rounded-xl transition-colors w-full text-left">
              <Copy className="w-4 h-4" /> 복사
            </button>
            {isMine && (
              <button onClick={handleDelete} className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors w-full text-left">
                <Trash2 className="w-4 h-4" /> 삭제
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
