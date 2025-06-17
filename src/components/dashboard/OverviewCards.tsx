import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, TrendingDown, AlertTriangle, Clock, BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { DashboardStats } from "@/hooks/useDashboardStats";

interface OverviewCardsProps {
  stats: DashboardStats;
}

export default function OverviewCards({ stats }: OverviewCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAlunosAtivos}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Presença Hoje</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.presencaHoje.presentes}</div>
          <p className="text-xs text-muted-foreground">
            {stats.presencaHoje.total > 0
              ? `${Math.round((stats.presencaHoje.presentes / stats.presencaHoje.total) * 100)}% de presença`
              : "Sem dados"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Faltas Hoje</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.presencaHoje.faltas}</div>
          <p className="text-xs text-muted-foreground">
            {stats.presencaHoje.total > 0
              ? `${Math.round((stats.presencaHoje.faltas / stats.presencaHoje.total) * 100)}% de faltas`
              : "Sem dados"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alunos em Alerta</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.alunosAlertaEvasao}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalAlunosAtivos > 0
              ? `${Math.round((stats.alunosAlertaEvasao / stats.totalAlunosAtivos) * 100)}% dos alunos`
              : "Sem dados"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
