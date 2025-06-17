
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, UserX, Clock } from 'lucide-react';

interface RiskAlertsProps {
  alunosFaltososRecentes: Array<{
    aluno_id: string;
    aluno_nome: string;
    matricula: string;
    turma_nome: string;
    faltas_ultimos_7_dias: number;
    percentual_faltas: number;
  }>;
}

export const RiskAlerts: React.FC<RiskAlertsProps> = ({ alunosFaltososRecentes }) => {
  // Filtrar alunos com 3 ou mais faltas na semana
  const alunosAltoRisco = alunosFaltososRecentes.filter(aluno => aluno.faltas_ultimos_7_dias >= 3);
  
  const getRiskLevel = (faltas: number) => {
    if (faltas >= 5) return { level: 'crítico', color: 'destructive', icon: UserX };
    if (faltas >= 4) return { level: 'alto', color: 'default', icon: AlertTriangle };
    return { level: 'médio', color: 'secondary', icon: Clock };
  };

  if (alunosAltoRisco.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-green-600" />
            Alertas de Risco
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-green-200 bg-green-50">
            <AlertTriangle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Situação Controlada</AlertTitle>
            <AlertDescription className="text-green-700">
              Nenhum aluno com 3 ou mais faltas na semana. Continue monitorando!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          Alertas de Risco
          <Badge variant="destructive">{alunosAltoRisco.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">
              {alunosAltoRisco.length} aluno{alunosAltoRisco.length > 1 ? 's' : ''} em risco
            </AlertTitle>
            <AlertDescription className="text-red-700">
              Aluno{alunosAltoRisco.length > 1 ? 's' : ''} com 3+ faltas na semana. 
              Intervenção necessária para evitar evasão escolar.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            {alunosAltoRisco.slice(0, 5).map((aluno) => {
              const risk = getRiskLevel(aluno.faltas_ultimos_7_dias);
              const Icon = risk.icon;
              
              return (
                <div key={aluno.aluno_id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="font-medium text-red-900">{aluno.aluno_nome}</p>
                      <p className="text-xs text-red-700">
                        {aluno.matricula} - {aluno.turma_nome}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={risk.color as any} className="mb-1">
                      RISCO {risk.level.toUpperCase()}
                    </Badge>
                    <p className="text-xs text-red-700 font-medium">
                      {aluno.faltas_ultimos_7_dias} faltas
                    </p>
                  </div>
                </div>
              );
            })}
            
            {alunosAltoRisco.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{alunosAltoRisco.length - 5} aluno{alunosAltoRisco.length - 5 > 1 ? 's' : ''} adicional{alunosAltoRisco.length - 5 > 1 ? 'is' : ''}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
