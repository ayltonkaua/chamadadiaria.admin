import React from 'react';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import OverviewCards from '@/components/dashboard/OverviewCards';
import RankingTurmasChart from '@/components/dashboard/RankingTurmasChart';
import DistribuicaoTurnoChart from '@/components/dashboard/DistribuicaoTurnoChart';
import EvolutionChart from '@/components/dashboard/EvolutionChart';
import AlunosCriticosTable from '@/components/dashboard/AlunosCriticosTable';
import { OfflineIndicator } from '@/components/offline/OfflineIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Calendar, CheckCircle, XCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </CardTitle>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro ao carregar dashboard!</strong>
          <span className="block sm:inline"> Por favor, tente novamente mais tarde.</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Nenhum dado disponível!</strong>
          <span className="block sm:inline"> Não há dados para exibir no momento.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Visão geral completa do sistema de controle de frequência escolar
        </p>
      </div>

      <OfflineIndicator />

      {/* 1. Visão Geral - Cards principais */}
      <div className="px-2 sm:px-0">
        <OverviewCards stats={stats} />
      </div>

      {/* 2. Gráficos principais */}
      <div className="grid gap-6 md:grid-cols-2">
        <RankingTurmasChart data={stats.rankingTurmasComMaisFaltas} />
        <DistribuicaoTurnoChart data={stats.distribuicaoFaltasPorTurno} />
      </div>

      {/* 3. Gráficos secundários */}
      <div className="grid gap-6 md:grid-cols-2">
        <EvolutionChart data={stats.dadosUltimosMeses} />
        <AlunosCriticosTable data={stats.alunosSituacaoCritica} />
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
