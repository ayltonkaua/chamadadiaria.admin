
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, TrendingDown, AlertTriangle, Clock } from 'lucide-react';

interface OverviewCardsProps {
  totalAlunosAtivos: number;
  presencaHoje: {
    presentes: number;
    faltas: number;
    total: number;
  };
  mediaFaltasSemana: number;
  alunosAlertaEvasao: number;
  turmasSemChamadaHoje: number;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  totalAlunosAtivos,
  presencaHoje,
  mediaFaltasSemana,
  alunosAlertaEvasao,
  turmasSemChamadaHoje
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">🎯 Total de Alunos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{totalAlunosAtivos}</div>
          <p className="text-xs text-muted-foreground">Alunos ativos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">📅 Presença Hoje</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{presencaHoje.presentes}</div>
          <p className="text-xs text-muted-foreground">
            {presencaHoje.faltas} faltas de {presencaHoje.total} total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">📉 Média Faltas/Semana</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${mediaFaltasSemana <= 20 ? 'text-green-600' : mediaFaltasSemana <= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
            {mediaFaltasSemana.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">faltas por dia</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">🚨 Alerta Evasão</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${alunosAlertaEvasao === 0 ? 'text-green-600' : alunosAlertaEvasao <= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
            {alunosAlertaEvasao}
          </div>
          <p className="text-xs text-muted-foreground">frequência {'<'} 75%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">🔄 Sem Chamada Hoje</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${turmasSemChamadaHoje === 0 ? 'text-green-600' : turmasSemChamadaHoje <= 3 ? 'text-yellow-600' : 'text-red-600'}`}>
            {turmasSemChamadaHoje}
          </div>
          <p className="text-xs text-muted-foreground">turmas pendentes</p>
        </CardContent>
      </Card>
    </div>
  );
};
