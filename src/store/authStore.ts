import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  couple_id: string | null;
  status: 'SOLO' | 'WAITING' | 'COUPLED';
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  checkUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,

  checkUser: async () => {
    try {
      set({ isLoading: true });
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        set({ user: null, isLoading: false });
        return;
      }

      // 프로필 정보 가져오기
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || !profile) {
        console.error('Profile fetch error:', error);
        set({ user: null, isLoading: false });
        return;
      }

      set({ user: profile, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
