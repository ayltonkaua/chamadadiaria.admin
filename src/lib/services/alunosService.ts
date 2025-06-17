
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type Aluno = {
  id: string;
  nome: string;
  matricula: string;
  turma_id: string;
  created_at?: string;
};

export const alunosService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('alunos')
      .select('*, turma:turma_id(id, nome)');
    
    if (error) {
      toast({
        title: 'Erro ao carregar alunos',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
    return data || [];
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('alunos')
      .select('*, turma:turma_id(id, nome)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  create: async (aluno: {nome: string, matricula: string, turma_id: string}) => {
    const { data, error } = await supabase
      .from('alunos')
      .insert(aluno)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, aluno: Partial<{nome: string, matricula: string, turma_id: string}>) => {
    const { data, error } = await supabase
      .from('alunos')
      .update(aluno)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('alunos')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },
  
  getAlunosFaltosos: async (minFaltas = 3) => {
    try {
      const { data, error } = await supabase
        .from('alunos_faltosos')
        .select('*')
        .gte('total_faltas', minFaltas);
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Erro ao buscar alunos com faltas:', error);
      toast({
        title: 'Erro ao buscar dados',
        description: 'Não foi possível carregar os alunos com faltas.',
        variant: 'destructive',
      });
      return [];
    }
  }
};
