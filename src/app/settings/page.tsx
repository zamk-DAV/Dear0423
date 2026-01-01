'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, LogOut } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { THEMES, ThemeType } from '@/config/themes';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export default function SettingsPage() {
  const router = useRouter();
  const { theme: currentTheme, setTheme } = useThemeStore();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      await logout();
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 transition-colors duration-300">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md px-4 py-3 flex items-center gap-3 border-b border-border">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-primary">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-primary">테마 설정</h1>
      </header>

      {/* 테마 그리드 */}
      <div className="p-6">
        <h2 className="text-sm font-bold text-secondary mb-4 uppercase tracking-wider">Color Themes</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {THEMES.map((theme) => (
            <motion.button
              key={theme.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTheme(theme.id as ThemeType)}
              className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                currentTheme === theme.id 
                  ? 'border-primary bg-surface shadow-md' 
                  : 'border-transparent bg-white hover:bg-surface'
              }`}
            >
              {/* 컬러 프리뷰 원 */}
              <div 
                className="w-12 h-12 rounded-full shadow-sm border border-black/5"
                style={{ backgroundColor: theme.color }}
              />
              
              <span className={`text-sm font-medium ${
                currentTheme === theme.id ? 'text-primary' : 'text-secondary'
              }`}>
                {theme.name}
              </span>

              {/* 선택 체크 표시 */}
              {currentTheme === theme.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </motion.button>
          ))}
        </div>

        {/* 로그아웃 버튼 */}
        <button 
          onClick={handleLogout}
          className="w-full py-4 bg-surface text-red-500 font-bold rounded-2xl border border-border hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          로그아웃
        </button>
      </div>
    </div>
  );
}
