
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

interface AlunosCriticosTableProps {
  alunosSituacaoCritica: Array<{
    aluno_id: string;
    aluno_nome: string;
    matricula: string;
    turma_nome: string;
    total_faltas: number;
  }>;
}

export const AlunosCriticosTable: React.FC<AlunosCriticosTableProps> = ({ 
  alunosSituacaoCritica 
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Alunos em Situação Crítica (+12 Faltas)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="space-y-2 max-h-[200px] sm:max-h-[240px] overflow-y-auto">
          {alunosSituacaoCritica.length === 0 ? (
            <p className="text-center text-muted-foreground py-6 sm:py-8 text-xs sm:text-sm">
              Nenhum aluno com mais de 12 faltas no momento
            </p>
          ) : (
            alunosSituacaoCritica.slice(0, 10).map((aluno) => (
              <div key={aluno.aluno_id} className="flex items-center justify-between p-2 sm:p-3 border rounded-lg bg-muted/20">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-xs sm:text-sm truncate">{aluno.aluno_nome}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {aluno.matricula} • {aluno.turma_nome}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge 
                    variant={aluno.total_faltas >= 20 ? 'destructive' : 'secondary'}
                    className="text-xs px-1 py-0.5 sm:px-2 sm:py-1"
                  >
                    {aluno.total_faltas} faltas
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
