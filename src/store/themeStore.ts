import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ThemeType } from '@/config/themes';

interface ThemeStore {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'minimal',
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'dear-theme-storage',
    }
  )
);
