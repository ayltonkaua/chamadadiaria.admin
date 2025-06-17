
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TurmaStats {
  id: string;
  nome: string;
  total_alunos_faltosos: number;
  media_faltas: number;
  alunos: any[];
}

interface TurmasStatsGridProps {
  estatisticas: TurmaStats[];
  limiarFaltas: number;
  onViewTopStudents: (turmaStats: TurmaStats) => void;
}

const TurmasStatsGrid: React.FC<TurmasStatsGridProps> = ({
  estatisticas,
  limiarFaltas,
  onViewTopStudents
}) => {
  const estatisticasComFaltas = estatisticas.filter(est => est.total_alunos_faltosos > 0);

  if (estatisticasComFaltas.length === 0) {
    return (
      <div className="md:col-span-2 text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-lg font-medium">Sem dados para exibir</p>
        <p className="text-muted-foreground">
          Não há turmas com alunos que atendam ao critério de faltas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {estatisticasComFaltas.map(estatistica => (
        <Card key={estatistica.id}>
          <CardHeader>
            <CardTitle>{estatistica.nome}</CardTitle>
            <CardDescription>
              Estatísticas de faltas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  Alunos com faltas:
                </span>
                <Badge>{estatistica.total_alunos_faltosos}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  Média de faltas:
                </span>
                <Badge variant="outline">{estatistica.media_faltas.toFixed(1)}</Badge>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full" 
                  style={{ 
                    width: `${Math.min(100, (estatistica.media_faltas / 10) * 100)}%` 
                  }}
                ></div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-2"
                onClick={() => onViewTopStudents(estatistica)}
              >
                Ver 10 alunos com mais faltas
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TurmasStatsGrid;
