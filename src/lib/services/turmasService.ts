
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type Turma = {
  id: string;
  nome: string;
  numero_sala: string;
  created_at?: string;
  user_id?: string | null;
  usuario_email?: string;
};

export const turmasService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('turmas')
      .select('*');
    
    if (error) {
      toast({
        title: 'Erro ao carregar turmas',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
    
    // Formatar os dados para incluir o email do usuário
    const turmasFormatadas = await Promise.all(
      (data || []).map(async (turma) => {
        let usuario_email = 'Não atribuído';
        
        if (turma.user_id) {
          // Obter email do usuário diretamente do auth.users usando admin
          const { data: userData } = await supabase.auth.admin.getUserById(
            turma.user_id
          );
          
          if (userData && userData.user) {
            usuario_email = userData.user.email || 'Não atribuído';
          }
        }
        
        return {
          ...turma,
          usuario_email
        };
      })
    );
    
    return turmasFormatadas;
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('turmas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Adicionar o campo de email do usuário
    let usuario_email = 'Não atribuído';
    
    if (data && data.user_id) {
      // Obter email do usuário diretamente do auth.users usando admin
      const { data: userData } = await supabase.auth.admin.getUserById(
        data.user_id
      );
      
      if (userData && userData.user) {
        usuario_email = userData.user.email || 'Não atribuído';
      }
    }
    
    const turmaFormatada = data ? {
      ...data,
      usuario_email
    } : null;
    
    return turmaFormatada;
  },
  
  create: async (turma: {nome: string, numero_sala: string, user_id?: string | null}) => {
    // Obter o usuário atual se user_id não foi fornecido
    if (!turma.user_id) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        turma.user_id = session.user.id;
      }
    }
    
    const { data, error } = await supabase
      .from('turmas')
      .insert(turma)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, turma: Partial<{nome: string, numero_sala: string, user_id?: string | null}>) => {
    const { data, error } = await supabase
      .from('turmas')
      .update(turma)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('turmas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  getEstatiticas: async () => {
    try {
      const { data: turmas, error: turmasError } = await supabase
        .from('turmas')
        .select('id, nome');
      
      if (turmasError) throw turmasError;
      
      const stats = await Promise.all(
        (turmas || []).map(async (turma) => {
          const { data: presencas, error: presencasError } = await supabase
            .from('presencas')
            .select('presente')
            .eq('turma_id', turma.id);
          
          if (presencasError) throw presencasError;
          
          const presentes = (presencas || []).filter(p => p.presente).length;
          const ausentes = (presencas || []).length - presentes;
          const total = presencas?.length || 0;
          
          return {
            id: turma.id,
            nome: turma.nome,
            present_count: presentes,
            absent_count: ausentes,
            present_percentage: total > 0 ? (presentes / total) * 100 : 0,
            absent_percentage: total > 0 ? (ausentes / total) * 100 : 0
          };
        })
      );
      
      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as estatísticas de turmas.',
        variant: 'destructive',
      });
      return [];
    }
  }
};
