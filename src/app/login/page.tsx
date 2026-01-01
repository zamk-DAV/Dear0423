'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // 로그인 vs 회원가입 모드
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '', // 회원가입 때만 사용
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 가짜 이메일 생성 (username@dear.local)
    const email = `${formData.username}@dear.local`;

    try {
      if (isLogin) {
        // 로그인 시도
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: formData.password,
        });
        if (error) throw error;
        router.push('/'); // 성공 시 홈으로
      } else {
        // 회원가입 시도
        const { error } = await supabase.auth.signUp({
          email,
          password: formData.password,
          options: {
            data: {
              username: formData.username,
              nickname: formData.nickname,
            },
          },
        });
        if (error) throw error;
        alert('가입 환영합니다! 이제 로그인해주세요.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-border"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 border border-border">
            <Heart className="w-8 h-8 text-primary fill-primary" />
          </div>
          <h1 className="text-2xl font-bold text-primary font-serif italic">Dear</h1>
          <p className="text-sm text-secondary mt-1">우리 둘만의 특별한 공간</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-secondary mb-1 ml-1">아이디</label>
            <input 
              type="text" 
              required
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-gray-100 transition-all text-primary"
              placeholder="아이디 입력"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          {!isLogin && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
              <label className="block text-xs font-bold text-secondary mb-1 ml-1">애칭 (상대방에게 보여질 이름)</label>
              <input 
                type="text" 
                required={!isLogin}
                className="w-full bg-surface border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-gray-100 transition-all text-primary"
                placeholder="예: 공주님, 왕자님"
                value={formData.nickname}
                onChange={(e) => setFormData({...formData, nickname: e.target.value})}
              />
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-bold text-secondary mb-1 ml-1">비밀번호</label>
            <input 
              type="password" 
              required
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-gray-100 transition-all text-primary"
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-primary hover:bg-black/90 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLogin ? '로그인' : '가입하기'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-secondary hover:text-primary underline decoration-dashed underline-offset-4 transition-colors"
          >
            {isLogin ? '아직 계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
