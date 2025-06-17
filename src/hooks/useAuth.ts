import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));

// Inicializar o estado de autenticação
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session?.user) {
    // Buscar o papel do usuário
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          useAuth.getState().setUser({
            id: session.user.id,
            email: session.user.email!,
            role: data.role,
          });
        }
      });
  }
  useAuth.getState().setLoading(false);
});

// Atualizar o estado quando a autenticação mudar
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    // Buscar o papel do usuário
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          useAuth.getState().setUser({
            id: session.user.id,
            email: session.user.email!,
            role: data.role,
          });
        }
      });
  } else {
    useAuth.getState().setUser(null);
  }
}); 