
import React from 'react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { FrequenciaDiariaChart } from '@/components/dashboard/FrequenciaDiariaChart';
import { RankingTurmasChart } from '@/components/dashboard/RankingTurmasChart';
import { DistribuicaoTurnoChart } from '@/components/dashboard/DistribuicaoTurnoChart';
import { AlunosCriticosTable } from '@/components/dashboard/AlunosCriticosTable';
import { EvolutionChart } from '@/components/dashboard/EvolutionChart';
import { OfflineIndicator } from '@/components/offline/OfflineIndicator';

const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Carregando dados do dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">Erro ao carregar dados do dashboard</div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Visão geral completa do sistema de controle de frequência escolar
        </p>
      </div>

      <OfflineIndicator />

      {/* 1. Visão Geral - Cards principais */}
      <div className="px-2 sm:px-0">
        <OverviewCards
          totalAlunosAtivos={stats.totalAlunosAtivos}
          presencaHoje={stats.presencaHoje}
          mediaFaltasSemana={stats.mediaFaltasSemana}
          alunosAlertaEvasao={stats.alunosAlertaEvasao}
          turmasSemChamadaHoje={stats.turmasSemChamadaHoje}
        />
      </div>

      {/* 2. Gráficos principais */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2 px-2 sm:px-0">
        <FrequenciaDiariaChart frequenciaUltimos7Dias={stats.frequenciaUltimos7Dias} />
        <RankingTurmasChart rankingTurmasComMaisFaltas={stats.rankingTurmasComMaisFaltas} />
      </div>

      {/* 3. Gráficos secundários */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3 px-2 sm:px-0">
        <DistribuicaoTurnoChart distribuicaoFaltasPorTurno={stats.distribuicaoFaltasPorTurno} />
        <EvolutionChart dadosUltimosMeses={stats.dadosUltimosMeses} />
        <AlunosCriticosTable alunosSituacaoCritica={stats.alunosSituacaoCritica} />
      </div>
    </div>
  );
};

export default Dashboard;
