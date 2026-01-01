'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export default function ThemeInitializer() {
  const { theme } = useThemeStore();

  useEffect(() => {
    // 테마가 변경될 때마다 HTML 태그에 data-theme 속성 적용
    if (theme === 'minimal') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  return null; // 화면에 그릴 것은 없음
}
