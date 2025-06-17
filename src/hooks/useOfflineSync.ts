
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOnlineStatus } from './useOnlineStatus';
import { offlineService } from '@/lib/services/offlineService';
import { presencasService } from '@/lib/services/presencasService';
import { toast } from '@/hooks/use-toast';

export const useOfflineSync = () => {
  const isOnline = useOnlineStatus();
  const queryClient = useQueryClient();

  const syncOfflineData = useCallback(async () => {
    if (!isOnline) return;

    const offlineData = offlineService.getOfflinePresencas();
    if (offlineData.length === 0) return;

    console.log(`Sincronizando ${offlineData.length} registros offline...`);

    let successCount = 0;
    let errorCount = 0;

    for (const presenca of offlineData) {
      try {
        await presencasService.create({
          aluno_id: presenca.aluno_id,
          turma_id: presenca.turma_id,
          data_chamada: presenca.data_chamada,
          presente: presenca.presente,
          falta_justificada: presenca.falta_justificada,
          motivo_justificativa: presenca.motivo_justificativa
        });

        offlineService.removeOfflinePresenca(presenca.id);
        successCount++;
      } catch (error) {
        console.error('Erro ao sincronizar presença:', error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast({
        title: 'Sincronização concluída',
        description: `${successCount} registros foram sincronizados com sucesso.`,
      });

      // Invalidar queries para atualizar os dados na interface
      queryClient.invalidateQueries({ queryKey: ['presencas'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    }

    if (errorCount > 0) {
      toast({
        title: 'Erro na sincronização',
        description: `${errorCount} registros falharam na sincronização. Eles serão mantidos para nova tentativa.`,
        variant: 'destructive',
      });
    }
  }, [isOnline, queryClient]);

  // Sincronizar automaticamente quando voltar online
  useEffect(() => {
    if (isOnline && offlineService.hasOfflineData()) {
      // Aguardar um pouco para garantir que a conexão está estável
      const timer = setTimeout(() => {
        syncOfflineData();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, syncOfflineData]);

  return {
    isOnline,
    hasOfflineData: offlineService.hasOfflineData(),
    syncOfflineData,
    offlineCount: offlineService.getOfflinePresencas().length
  };
};
