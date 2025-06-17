
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataTable } from '@/components/ui/data-table';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { presencasService } from '@/lib/services/presencasService';
import { createAttendanceHistoryColumns } from './AttendanceHistoryColumns';

interface AttendanceHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turmaId: string;
  turmaNome: string;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
  open,
  onOpenChange,
  turmaId,
  turmaNome,
}) => {
  const queryClient = useQueryClient();

  const { data: presencas = [], isLoading } = useQuery({
    queryKey: ['presencas', turmaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('presencas')
        .select(`
          *,
          aluno:aluno_id (id, nome, matricula),
          justificativas_faltas (id, motivo)
        `)
        .eq('turma_id', turmaId)
        .order('data_chamada', { ascending: false });
      
      if (error) throw error;
      return (data || []).map((presenca: any) => ({
        ...presenca,
        justificativa: presenca.justificativas_faltas?.[0] || null
      }));
    },
    enabled: open,
  });

  const handleUpdatePresenca = async (id: string, presente: boolean) => {
    try {
      await presencasService.updateStatus(id, presente);
      
      toast({
        title: 'Sucesso',
        description: `Presença ${presente ? 'confirmada' : 'removida'} com sucesso!`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['presencas'] });
      queryClient.invalidateQueries({ queryKey: ['presencas', turmaId] });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a presença.',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePresenca = async (id: string) => {
    try {
      await presencasService.delete(id);
      
      toast({
        title: 'Sucesso',
        description: 'Registro de presença removido com sucesso!',
      });
      
      queryClient.invalidateQueries({ queryKey: ['presencas'] });
      queryClient.invalidateQueries({ queryKey: ['presencas', turmaId] });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o registro.',
        variant: 'destructive',
      });
    }
  };

  const columns = createAttendanceHistoryColumns({
    onUpdatePresenca: handleUpdatePresenca,
    onDeletePresenca: handleDeletePresenca,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Chamadas - {turmaNome}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="text-center py-8">Carregando histórico...</div>
          ) : (
            <DataTable
              columns={columns}
              data={presencas}
              filterPlaceholder="Buscar por nome do aluno..."
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
