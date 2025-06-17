
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, UserX, AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardStatsProps {
  totalAlunos: number;
  percentualPresenca: number;
  percentualFalta: number;
  totalPresencas: number;
  totalFaltas: number;
  alunosFaltososRecentes: number;
  tendencia: 'subindo' | 'descendo' | 'estavel';
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalAlunos,
  percentualPresenca,
  percentualFalta,
  totalPresencas,
  totalFaltas,
  alunosFaltososRecentes,
  tendencia
}) => {
  const getTrendIcon = () => {
    switch (tendencia) {
      case 'subindo': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'descendo': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = () => {
    switch (tendencia) {
      case 'subindo': return 'text-green-600';
      case 'descendo': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAlunos}</div>
          <p className="text-xs text-muted-foreground">
            Alunos matriculados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Frequência Geral</CardTitle>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${percentualPresenca >= 85 ? 'text-green-600' : percentualPresenca >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
            {percentualPresenca.toFixed(1)}%
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">
              {totalPresencas} presenças
            </p>
            <Badge variant={tendencia === 'subindo' ? 'default' : tendencia === 'descendo' ? 'destructive' : 'secondary'} className="text-xs">
              {tendencia === 'subindo' ? 'Melhorando' : tendencia === 'descendo' ? 'Piorando' : 'Estável'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Faltas</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${percentualFalta <= 15 ? 'text-green-600' : percentualFalta <= 30 ? 'text-yellow-600' : 'text-red-600'}`}>
            {percentualFalta.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {totalFaltas} faltas registradas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Alunos em Risco</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${alunosFaltososRecentes === 0 ? 'text-green-600' : alunosFaltososRecentes <= 5 ? 'text-yellow-600' : 'text-red-600'}`}>
            {alunosFaltososRecentes}
          </div>
          <p className="text-xs text-muted-foreground">
            Com muitas faltas (7 dias)
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
