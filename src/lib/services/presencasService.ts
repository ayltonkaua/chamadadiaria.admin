import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { formatToDBDate } from '@/lib/utils';

export type Presenca = {
  id: string;
  aluno_id: string;
  turma_id: string;
  data_chamada: string;
  presente: boolean;
  falta_justificada?: boolean;
  created_at?: string;
  aluno?: { id: string; nome: string };
  turma?: { id: string; nome: string };
  usuario_email?: string;
  justificativa?: {
    id: string;
    motivo: string;
  };
};

export const presencasService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('presencas')
      .select(`
        *,
        aluno:aluno_id (id, nome),
        turma:turma_id (id, nome),
        justificativas_faltas (id, motivo)
      `)
      .order('data_chamada', { ascending: false });
    
    if (error) {
      toast({
        title: 'Erro ao carregar presenças',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
    
    // For each presence record, try to get email information about who created it
    const presencasFormatadas = await Promise.all(
      (data || []).map(async (presenca: any) => {
        let usuario_email = 'Não registrado';
        
        return {
          ...presenca,
          usuario_email,
          justificativa: presenca.justificativas_faltas?.[0] || null
        };
      })
    );
    
    return presencasFormatadas;
  },
  
  getByTurmaData: async (turma_id: string, data_chamada: string) => {
    // Garantir que a data está no formato correto para o banco de dados (YYYY-MM-DD)
    const formattedDate = formatToDBDate(data_chamada);
    
    const { data, error } = await supabase
      .from('presencas')
      .select(`
        *,
        aluno:aluno_id (id, nome),
        justificativas_faltas (id, motivo)
      `)
      .eq('turma_id', turma_id)
      .eq('data_chamada', formattedDate);
    
    if (error) throw error;
    
    return (data || []).map((presenca: any) => ({
      ...presenca,
      justificativa: presenca.justificativas_faltas?.[0] || null
    }));
  },
  
  create: async (presenca: {
    data_chamada: string, 
    turma_id: string, 
    aluno_id: string, 
    presente: boolean, 
    falta_justificada?: boolean,
    motivo_justificativa?: string
  }) => {
    console.log("Creating presence with data:", presenca);
    
    // Verificar se está offline
    if (!navigator.onLine) {
      // Salvar offline
      const { offlineService } = await import('@/lib/services/offlineService');
      return offlineService.saveOfflinePresenca(presenca);
    }
    
    // Formatação da data para garantir consistência com o formato do banco de dados
    const formattedDate = formatToDBDate(presenca.data_chamada);
    
    // Create presence record
    const presencaFormatada = {
      data_chamada: formattedDate,
      turma_id: presenca.turma_id,
      aluno_id: presenca.aluno_id,
      presente: presenca.presente,
      falta_justificada: presenca.falta_justificada || false
    };
    
    console.log("Formatted presence data to save:", presencaFormatada);
    
    const { data: presencaData, error: presencaError } = await supabase
      .from('presencas')
      .insert(presencaFormatada)
      .select()
      .single();
    
    if (presencaError) {
      console.error("Error saving presence:", presencaError);
      throw presencaError;
    }
    
    // Se a falta é justificada e há um motivo, criar o registro de justificativa
    if (presenca.falta_justificada && presenca.motivo_justificativa && !presenca.presente) {
      const { error: justificativaError } = await supabase
        .from('justificativas_faltas')
        .insert({
          presenca_id: presencaData.id,
          motivo: presenca.motivo_justificativa
        });
      
      if (justificativaError) {
        console.error("Error saving justificativa:", justificativaError);
        // Não falhar se não conseguir salvar a justificativa, apenas logar o erro
      }
    }
    
    console.log("Saved presence result:", presencaData);
    return presencaData;
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
    // Primeiro, deletar justificativas relacionadas (será feito automaticamente pelo CASCADE)
    const { error } = await supabase
      .from('presencas')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
