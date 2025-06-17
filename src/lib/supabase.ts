
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Usar as constantes do arquivo client.ts onde estão os dados oficiais do projeto
import { supabase as officialSupabaseClient } from '@/integrations/supabase/client';

// Tipos das tabelas do banco de dados
export type User = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: string;
};

export type Student = {
  id: string;
  nome: string;
  matricula: string;
  turma_id: string;
  created_at?: string;
};

export type Class = {
  id: string;
  nome: string;
  numero_sala: string;
  created_at?: string;
};

export type Attendance = {
  id: string;
  aluno_id: string;
  turma_id: string;
  data_chamada: string;
  presente: boolean;
  created_at?: string;
};

// Exportar o cliente oficial do Supabase
export const supabase = officialSupabaseClient;

// Funções para obter dados de estudantes com 3 ou mais faltas
export async function getStudentsWithMultipleAbsences(minAbsences = 3) {
  try {
    const { data, error } = await supabase
      .from('alunos_faltosos')
      .select('*')
      .gte('total_faltas', minAbsences);
    
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

// Função para obter estatísticas de frequência por turma
export async function getClassAttendanceStats() {
  try {
    // Buscar todas as turmas
    const { data: turmas, error: turmasError } = await supabase
      .from('turmas')
      .select('id, nome');
    
    if (turmasError) throw turmasError;
    
    // Para cada turma, calcular estatísticas
    const stats = await Promise.all(
      (turmas || []).map(async (turma) => {
        // Buscar todas as presenças da turma
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
          total_alunos: total,
          presentes,
          ausentes,
          media_presenca: total > 0 ? ((presentes / total) * 100).toFixed(1) : '0.0'
        };
      })
    );
    
    return stats;
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas de frequência:', error);
    toast({
      title: 'Erro ao buscar dados',
      description: 'Não foi possível carregar as estatísticas de frequência.',
      variant: 'destructive',
    });
    return [];
  }
}

// Funções para CRUD de alunos
export const alunosService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('alunos')
      .select('*, turma:turma_id(id, nome)');
    
    if (error) throw error;
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
  }
};

// Funções para CRUD de turmas
export const turmasService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('turmas')
      .select('*');
    
    if (error) throw error;
    return data || [];
  },
  
  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('turmas')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  create: async (turma: {nome: string, numero_sala: string}) => {
    const { data, error } = await supabase
      .from('turmas')
      .insert(turma)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  update: async (id: string, turma: Partial<{nome: string, numero_sala: string}>) => {
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
  }
};

// Funções para CRUD de presenças/chamadas
export const presencasService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('presencas')
      .select('*, aluno:aluno_id(id, nome), turma:turma_id(id, nome)')
      .order('data_chamada', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },
  
  getByTurmaData: async (turma_id: string, data_chamada: string) => {
    const { data, error } = await supabase
      .from('presencas')
      .select('*, aluno:aluno_id(id, nome)')
      .eq('turma_id', turma_id)
      .eq('data_chamada', data_chamada);
    
    if (error) throw error;
    return data || [];
  },
  
  create: async (presenca: {data_chamada: string, turma_id: string, aluno_id: string, presente: boolean}) => {
    const { data, error } = await supabase
      .from('presencas')
      .insert(presenca)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  updateStatus: async (id: string, presente: boolean) => {
    const { data, error } = await supabase
      .from('presencas')
      .update({ presente })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },
  
  delete: async (id: string) => {
    const { error } = await supabase
      .from('presencas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};

// Habilitar suporte a atualizações em tempo real para as tabelas
export function enableRealtimeSubscription() {
  const channel = supabase.channel('schema-db-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'alunos' }, payload => {
      console.log('Alteração em alunos:', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'turmas' }, payload => {
      console.log('Alteração em turmas:', payload);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'presencas' }, payload => {
      console.log('Alteração em presenças:', payload);
    })
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
}
