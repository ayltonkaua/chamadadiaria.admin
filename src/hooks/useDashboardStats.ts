import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalTurmas: number;
  totalPresencas: number;
  presencasHoje: number;
  faltasHoje: number;
}

export function useDashboardStats() {
  const { data: stats, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      // Buscar total de usuários
      const { count: totalUsers } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      // Buscar total de turmas
      const { count: totalTurmas } = await supabase
        .from('turmas')
        .select('*', { count: 'exact', head: true });

      // Buscar total de presenças
      const { count: totalPresencas } = await supabase
        .from('presencas')
        .select('*', { count: 'exact', head: true });

      // Buscar presenças e faltas de hoje
      const hoje = new Date().toISOString().split('T')[0];
      const { data: presencasHoje } = await supabase
        .from('presencas')
        .select('presente, falta_justificada')
        .eq('data_chamada', hoje);

      const presentesHoje = presencasHoje?.filter(p => p.presente).length || 0;
      const faltasHoje = presencasHoje?.filter(p => !p.presente && !p.falta_justificada).length || 0;

      return {
        totalUsers: totalUsers || 0,
        totalTurmas: totalTurmas || 0,
        totalPresencas: totalPresencas || 0,
        presencasHoje: presentesHoje,
        faltasHoje,
      };
    },
  });

  return {
    stats,
    isLoading,
    error,
  };
}
