'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { createInvitation, joinCouple } from '@/lib/actions/couple';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ArrowRight, HeartHandshake, Loader2 } from 'lucide-react';

export default function ConnectPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [mode, setMode] = useState<'invite' | 'join'>('invite');
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [notionKey, setNotionKey] = useState('');
  const [notionDbId, setNotionDbId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateCode = async () => {
    if (!user) return;
    if (!notionKey || !notionDbId) {
      alert('Notion 정보를 모두 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const data = await createInvitation(user.id, notionKey, notionDbId);
      setInviteCode(data.code);
    } catch (e) {
      alert('코드 생성 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!user || !inputCode) return;
    setLoading(true);
    try {
      await joinCouple(user.id, inputCode);
      alert('연결되었습니다! 환영합니다.');
      router.push('/'); // 홈으로 이동
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-20 h-20 bg-surface rounded-full shadow-lg mx-auto flex items-center justify-center mb-4 border border-border"
          >
            <HeartHandshake className="w-10 h-10 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold text-primary">커플 연결</h1>
          <p className="text-secondary mt-2 text-sm">서로의 코드를 입력하여 연결하세요.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-2 mb-6 flex border border-border">
          <button 
            onClick={() => setMode('invite')}
            className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${mode === 'invite' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-surface'}`}
          >
            코드 보내기
          </button>
          <button 
            onClick={() => setMode('join')}
            className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${mode === 'join' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:bg-surface'}`}
          >
            코드 입력하기
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'invite' ? (
            <motion.div 
              key="invite"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white rounded-3xl p-8 shadow-lg text-center border border-border"
            >
              {!inviteCode ? (
                <>
                  <p className="text-sm text-secondary mb-4">
                    커플 다이어리를 위해<br/>
                    <span className="font-bold text-primary">Notion 정보</span>를 입력해주세요.
                  </p>
                  
                  <div className="flex flex-col gap-3 mb-6">
                    <input 
                      type="text" 
                      placeholder="Notion API Key (secret_...)"
                      value={notionKey}
                      onChange={(e) => setNotionKey(e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors text-primary"
                    />
                    <input 
                      type="text" 
                      placeholder="Database ID"
                      value={notionDbId}
                      onChange={(e) => setNotionDbId(e.target.value)}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm outline-none focus:border-primary transition-colors text-primary"
                    />
                  </div>

                  <button 
                    onClick={handleCreateCode}
                    disabled={loading || !notionKey || !notionDbId}
                    className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black/90 transition-colors flex justify-center disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" /> : '설정 저장 및 코드 생성'}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-secondary mb-2">상대방에게 이 코드를 알려주세요.</p>
                  <div className="text-4xl font-black text-primary tracking-widest bg-surface py-6 rounded-2xl border border-border border-dashed">
                    {inviteCode}
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(inviteCode);
                      alert('복사되었습니다!');
                    }}
                    className="flex items-center justify-center gap-2 text-secondary hover:text-primary py-2"
                  >
                    <Copy className="w-4 h-4" /> 코드 복사하기
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="join"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white rounded-3xl p-8 shadow-lg text-center border border-border"
            >
              <p className="text-sm text-secondary mb-6">상대방에게 받은<br/>초대 코드를 입력하세요.</p>
              <input 
                type="text" 
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="코드 6자리 (예: X7K9P2)"
                className="w-full text-center text-2xl font-bold tracking-widest py-4 bg-surface border-b-2 border-border focus:border-primary outline-none rounded-t-xl mb-6 uppercase placeholder:text-gray-300 placeholder:text-lg placeholder:font-normal placeholder:tracking-normal text-primary"
                maxLength={6}
              />
              <button 
                onClick={handleJoin}
                disabled={!inputCode || loading}
                className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black/90 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>연결 시작하기 <ArrowRight className="w-4 h-4" /></>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
