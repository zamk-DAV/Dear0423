import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WidgetStore {
  order: string[];
  setOrder: (newOrder: string[]) => void;
  resetOrder: () => void;
}

// 기본 위젯 순서 정의
const DEFAULT_ORDER = [
  'couple-photo',
  'd-day',
  'status',
  'heart',
  'feed-preview',
  'notification'
];

export const useWidgetStore = create<WidgetStore>()(
  persist(
    (set) => ({
      order: DEFAULT_ORDER,
      setOrder: (newOrder) => set({ order: newOrder }),
      resetOrder: () => set({ order: DEFAULT_ORDER }),
    }),
    {
      name: 'dear-widget-order-storage', // 로컬 스토리지 키 이름
    }
  )
);
