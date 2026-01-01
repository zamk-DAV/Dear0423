'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import { ArrowLeft, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { groupMessagesByDate } from '@/lib/utils';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  type: string;
}

export default function ChatPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [partnerName, setPartnerName] = useState('상대방');
  const scrollRef = useRef<HTMLDivElement>(null);

  // 1. 초기 메시지 로드 및 구독 설정
  useEffect(() => {
    if (!user || !user.couple_id) return;

    // (0) 상대방 닉네임 가져오기
    const fetchPartner = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('couple_id', user.couple_id)
        .neq('id', user.id)
        .single();
      if (data) setPartnerName(data.nickname || '상대방');
    };
    fetchPartner();

    // (1) 기존 메시지 가져오기 (최근 100개)
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('couple_id', user.couple_id)
        .order('created_at', { ascending: true })
        .limit(100);
      
      if (data) setMessages(data);
    };

    fetchMessages();

    // (2) 실시간 구독 (Realtime)
    const channel = supabase
      .channel('chat-room')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE 모두 감지
          schema: 'public',
          table: 'messages',
          filter: `couple_id=eq.${user.couple_id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new as Message]);
          } else if (payload.eventType === 'DELETE') {
            setMessages((prev) => prev.filter(msg => msg.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setMessages((prev) => prev.map(msg => msg.id === payload.new.id ? payload.new as Message : msg));
          }
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // 스크롤 하단 고정
  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송 핸들러
  const sendMessage = async (text: string) => {
    if (!user || !user.couple_id) return;

    // 텍스트인지 이미지인지 판별 (간단하게 URL 형식이면 이미지로 간주하거나 별도 타입 필요)
    // 여기선 일단 text로 통일하고 추후 고도화
    await supabase.from('messages').insert({
      couple_id: user.couple_id,
      sender_id: user.id,
      content: text,
      type: 'text',
    });
  };

  // 날짜별 그룹화
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-screen bg-secondary">
      {/* 헤더 */}
      <header className="bg-background/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between sticky top-0 z-10 border-b border-border">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-base font-bold text-primary">{partnerName}</h1>
        <button className="p-2 -mr-2 text-primary">
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* 메시지 리스트 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            {/* 날짜 구분선 */}
            <div className="flex justify-center my-4">
              <span className="bg-surface/80 text-secondary text-xs px-3 py-1 rounded-full border border-border shadow-sm">
                {date}
              </span>
            </div>
            
            {msgs.map((msg) => (
              <ChatBubble 
                key={msg.id}
                id={msg.id}
                content={msg.content}
                type={msg.type as 'text' | 'image'}
                isMine={msg.sender_id === user?.id}
                timestamp={msg.created_at}
                isRead={msg.is_read}
              />
            ))}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* 입력창 */}
      <ChatInput onSendMessage={sendMessage} disabled={!user?.couple_id} />
    </div>
  );
}