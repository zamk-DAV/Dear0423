export const THEMES = [
  { id: 'minimal', name: '미니멀', color: '#000000' },
  { id: 'apple', name: '애플', color: '#8B3A4A' },
  { id: 'forest', name: '숲속 친구들', color: '#5A6B51' },
  { id: 'clay', name: '지점토', color: '#6E6062' },
  { id: 'cat', name: '삼색고양이', color: '#8B7875' },
  { id: 'morning', name: '아침 노을', color: '#AA7B65' },
  { id: 'pastel', name: '파스텔', color: '#8A92A0' },
  { id: 'purple', name: '퍼플 밀크티', color: '#3C4362' },
  { id: 'dark', name: '다크 모드', color: '#121212' },
] as const;

export type ThemeType = typeof THEMES[number]['id'];
