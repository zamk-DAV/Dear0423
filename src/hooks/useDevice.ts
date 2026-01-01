'use client';

import { useState, useEffect } from 'react';

export const useDevice = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoaded, setIsMobileLoaded] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      // 768px 미만을 모바일 기준으로 설정
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    setIsMobileLoaded(true);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, isLoaded };
};
