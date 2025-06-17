
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AttendanceRecord {
  id: string;
  data_chamada: string;
  presente: boolean;
  falta_justificada: boolean;
  aluno: { nome: string };
  justificativa?: { id: string; motivo: string } | null;
}

export const useAttendanceEdit = (presenca: AttendanceRecord | null) => {
  const [status, setStatus] = useState<'presente' | 'falta' | 'falta_justificada'>('presente');
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (presenca) {
      if (presenca.presente) {
        setStatus('presente');
        setMotivo('');
      } else if (presenca.falta_justificada) {
        setStatus('falta_justificada');
        setMotivo(presenca.justificativa?.motivo || '');
      } else {
        setStatus('falta');
        setMotivo('');
      }
    }
  }, [presenca]);

  const resetForm = () => {
    if (presenca) {
      if (presenca.presente) {
        setStatus('presente');
        setMotivo('');
      } else if (presenca.falta_justificada) {
        setStatus('falta_justificada');
        setMotivo(presenca.justificativa?.motivo || '');
      } else {
        setStatus('falta');
        setMotivo('');
      }
    }
  };

  const saveAttendance = async (onSuccess: () => void) => {
    if (!presenca) return;

    setLoading(true);
    try {
      const presente = status === 'presente';
      const falta_justificada = status === 'falta_justificada';

      console.log('Updating presence with:', { presente, falta_justificada, status });

      // Atualizar o registro de presença
      const { error: presencaError } = await supabase
        .from('presencas')
        .update({ 
          presente,
          falta_justificada
        })
        .eq('id', presenca.id);

      if (presencaError) {
        console.error('Erro ao atualizar presença:', presencaError);
        throw presencaError;
      }

      // Gerenciar justificativas
      if (presenca.justificativa?.id) {
        // Se tinha justificativa antes, sempre deletar primeiro
        const { error: deleteError } = await supabase
          .from('justificativas_faltas')
          .delete()
          .eq('id', presenca.justificativa.id);

        if (deleteError) {
          console.error('Erro ao deletar justificativa:', deleteError);
          throw deleteError;
        }
      }

      // Se agora é falta justificada e tem motivo, criar nova justificativa
      if (falta_justificada && motivo.trim()) {
        const { error: justificativaError } = await supabase
          .from('justificativas_faltas')
          .insert({
            presenca_id: presenca.id,
            motivo: motivo.trim()
          });

        if (justificativaError) {
          console.error('Erro ao criar justificativa:', justificativaError);
          throw justificativaError;
        }
      }

      toast({
        title: 'Status atualizado',
        description: 'O status da presença foi atualizado com sucesso.',
      });

      onSuccess();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o status da presença.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    setStatus,
    motivo,
    setMotivo,
    loading,
    resetForm,
    saveAttendance
  };
};
