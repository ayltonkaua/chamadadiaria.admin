
import { toast } from '@/hooks/use-toast';

export interface OfflinePresenca {
  id: string;
  aluno_id: string;
  turma_id: string;
  data_chamada: string;
  presente: boolean;
  falta_justificada?: boolean;
  motivo_justificativa?: string;
  timestamp: number;
}

const OFFLINE_STORAGE_KEY = 'offline_presencas';

export const offlineService = {
  // Salvar dados offline
  saveOfflinePresenca: (presenca: Omit<OfflinePresenca, 'id' | 'timestamp'>) => {
    const offlinePresenca: OfflinePresenca = {
      ...presenca,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    const existingData = offlineService.getOfflinePresencas();
    const updatedData = [...existingData, offlinePresenca];
    
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updatedData));
    
    toast({
      title: 'Dados salvos offline',
      description: 'A chamada foi salva localmente e será sincronizada quando a internet retornar.',
      variant: 'default',
    });

    return offlinePresenca;
  },

  // Buscar dados offline
  getOfflinePresencas: (): OfflinePresenca[] => {
    try {
      const data = localStorage.getItem(OFFLINE_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao recuperar dados offline:', error);
      return [];
    }
  },

  // Limpar dados após sincronização
  clearOfflinePresencas: () => {
    localStorage.removeItem(OFFLINE_STORAGE_KEY);
  },

  // Remover uma presença específica após sincronização
  removeOfflinePresenca: (id: string) => {
    const existingData = offlineService.getOfflinePresencas();
    const updatedData = existingData.filter(item => item.id !== id);
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(updatedData));
  },

  // Verificar se há dados para sincronizar
  hasOfflineData: (): boolean => {
    return offlineService.getOfflinePresencas().length > 0;
  }
};
