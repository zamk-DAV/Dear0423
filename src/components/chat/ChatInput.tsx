'use client';

import { useState, useRef } from 'react';
import { Send, Plus, Smile } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSendMessage, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSendMessage(text);
    setText('');
    // 높이 초기화
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white border-t border-border p-3 pb-6 flex items-end gap-2 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
      <button className="p-2 text-secondary hover:text-primary transition-colors">
        <Plus className="w-6 h-6" />
      </button>
      
      <div className="flex-1 bg-surface rounded-2xl px-4 py-2 flex items-center gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지 입력..."
          className="bg-transparent w-full text-sm outline-none resize-none max-h-24 py-1 text-primary placeholder:text-secondary"
          rows={1}
          style={{ minHeight: '24px' }}
        />
      </div>

      <button 
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        className={`p-3 rounded-full transition-all duration-200 ${
          text.trim() ? 'bg-primary text-white shadow-md scale-100' : 'bg-surface text-secondary scale-90 opacity-0'
        }`}
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
