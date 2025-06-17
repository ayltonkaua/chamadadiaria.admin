import React from 'react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { OverviewCards } from '@/components/dashboard/OverviewCards';
import { FrequenciaDiariaChart } from '@/components/dashboard/FrequenciaDiariaChart';
import { RankingTurmasChart } from '@/components/dashboard/RankingTurmasChart';
import { DistribuicaoTurnoChart } from '@/components/dashboard/DistribuicaoTurnoChart';
import { AlunosCriticosTable } from '@/components/dashboard/AlunosCriticosTable';
import { EvolutionChart } from '@/components/dashboard/EvolutionChart';
import { OfflineIndicator } from '@/components/offline/OfflineIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Calendar, CheckCircle, XCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
              </CardTitle>
              <div className="h-8 w-8 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">Erro ao carregar dados do dashboard</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Nenhum dado disponível</p>
      </div>
    );
  }

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTurmas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presenças Hoje</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.presencasHoje}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faltas Hoje</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.faltasHoje}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
