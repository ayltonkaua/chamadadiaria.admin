
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { School, Users, AlertTriangle } from 'lucide-react';

interface ClassStatisticsProps {
  estatisticasTurmas: Array<{
    id: string;
    nome: string;
    total_alunos: number;
    total_registros: number;
    percentual_presenca: number;
    percentual_falta: number;
    alunos_criticos: number;
  }>;
}

export const ClassStatistics: React.FC<ClassStatisticsProps> = ({ estatisticasTurmas }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5" />
          Estatísticas por Turma
        </CardTitle>
        <CardDescription>
          Desempenho de frequência e alunos em situação crítica
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {estatisticasTurmas.map((turma) => (
            <div key={turma.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-medium">{turma.nome}</p>
                  {turma.alunos_criticos > 0 && (
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {turma.total_alunos} alunos
                  </span>
                  <span>{turma.total_registros} registros</span>
                  {turma.alunos_criticos > 0 && (
                    <span className="text-orange-600 font-medium">
                      {turma.alunos_criticos} em risco
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Badge 
                  variant="default" 
                  className={`${
                    turma.percentual_presenca >= 85 
                      ? 'bg-green-100 text-green-800' 
                      : turma.percentual_presenca >= 70 
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {turma.percentual_presenca.toFixed(1)}% presente
                </Badge>
                {turma.percentual_falta > 20 && (
                  <Badge variant="destructive" className="bg-red-100 text-red-800">
                    {turma.percentual_falta.toFixed(1)}% faltas
                  </Badge>
                )}
              </div>
            </div>
          ))}
          {estatisticasTurmas.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Nenhuma turma encontrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
