
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock } from 'lucide-react';

interface AbsentStudentsListProps {
  alunosFaltososRecentes: Array<{
    aluno_id: string;
    aluno_nome: string;
    matricula: string;
    turma_nome: string;
    faltas_ultimos_7_dias: number;
    percentual_faltas: number;
  }>;
}

export const AbsentStudentsList: React.FC<AbsentStudentsListProps> = ({ alunosFaltososRecentes }) => {
  const getPriorityLevel = (percentual: number) => {
    if (percentual >= 70) return { variant: 'destructive' as const, label: 'CRÍTICO', icon: AlertTriangle };
    if (percentual >= 50) return { variant: 'default' as const, label: 'ALTO RISCO', icon: AlertTriangle };
    return { variant: 'secondary' as const, label: 'ATENÇÃO', icon: Clock };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alunos que Requerem Atenção
        </CardTitle>
        <CardDescription>
          Alunos com alta taxa de faltas nos últimos 7 dias - Prioridade para intervenção
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alunosFaltososRecentes.length > 0 ? (
          <div className="space-y-3">
            {alunosFaltososRecentes.map((aluno, index) => {
              const priority = getPriorityLevel(aluno.percentual_faltas);
              const Icon = priority.icon;
              
              return (
                <div key={aluno.aluno_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{aluno.aluno_nome}</p>
                        <Icon className="h-4 w-4 text-orange-500" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {aluno.matricula} - {aluno.turma_nome}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={priority.variant}>
                      {priority.label}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        {aluno.faltas_ultimos_7_dias} faltas
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {aluno.percentual_faltas.toFixed(1)}% de faltas
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-green-600 mb-2">
              Excelente! 
            </p>
            <p className="text-muted-foreground">
              Nenhum aluno com alta taxa de faltas nos últimos 7 dias
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
