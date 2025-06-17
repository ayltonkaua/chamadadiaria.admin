
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Turma } from '@/lib/services/turmasService';
import { Presenca } from '@/lib/services/presencasService';
import { AttendanceHistory } from './AttendanceHistory';
import { History } from 'lucide-react';

interface AttendanceStatsProps {
  turmas: Turma[];
  presencas: Presenca[];
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ turmas, presencas }) => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedTurma, setSelectedTurma] = useState<{id: string, nome: string} | null>(null);

  const openHistory = (turma: Turma) => {
    setSelectedTurma({ id: turma.id, nome: turma.nome });
    setHistoryOpen(true);
  };

  // Obter data de hoje para filtrar presenças do dia
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {turmas.map(turma => {
          const turmaPresencas = presencas.filter(p => p.turma_id === turma.id);
          const presencasHoje = turmaPresencas.filter(p => 
            new Date(p.data_chamada).toISOString().split('T')[0] === today
          );
          
          const presentes = turmaPresencas.filter(p => p.presente).length;
          const ausentes = turmaPresencas.length - presentes;
          const porcentagem = turmaPresencas.length > 0 
            ? (presentes / turmaPresencas.length * 100).toFixed(1) 
            : '0.0';

          // Dados do dia
          const presentesHoje = presencasHoje.filter(p => p.presente).length;
          const ausentesHoje = presencasHoje.length - presentesHoje;
          const porcentagemHoje = presencasHoje.length > 0 
            ? (presentesHoje / presencasHoje.length * 100).toFixed(1) 
            : '0.0';
          
          return (
            <Card key={turma.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg md:text-xl text-primary">{turma.nome}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openHistory(turma)}
                    className="flex items-center gap-1"
                  >
                    <History className="h-4 w-4" />
                    Histórico
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Estatísticas Gerais */}
                  <div>
                    <div className="flex justify-between text-sm md:text-base mb-2">
                      <span className="text-muted-foreground">Taxa de presença geral:</span>
                      <span className="font-bold text-primary">{porcentagem}%</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                      <div 
                        className="gradient-primary h-full transition-all duration-500" 
                        style={{ width: `${porcentagem}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div className="bg-muted p-2 rounded-lg text-center">
                        <div className="text-xs md:text-sm text-muted-foreground">Total Presentes</div>
                        <div className="font-bold text-base md:text-lg text-primary">{presentes}</div>
                      </div>
                      <div className="bg-muted p-2 rounded-lg text-center">
                        <div className="text-xs md:text-sm text-muted-foreground">Total Ausentes</div>
                        <div className="font-bold text-base md:text-lg text-destructive">{ausentes}</div>
                      </div>
                    </div>
                  </div>

                  {/* Dados do Dia */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Hoje ({new Date().toLocaleDateString('pt-BR')})</span>
                      <Badge variant="outline">
                        {presencasHoje.length} chamada{presencasHoje.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    
                    {presencasHoje.length > 0 ? (
                      <>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Taxa de presença:</span>
                          <span className="font-bold">{porcentagemHoje}%</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-green-50 border border-green-200 p-2 rounded-lg text-center">
                            <div className="text-xs text-green-700">Presentes</div>
                            <div className="font-bold text-green-800">{presentesHoje}</div>
                          </div>
                          <div className="bg-red-50 border border-red-200 p-2 rounded-lg text-center">
                            <div className="text-xs text-red-700">Ausentes</div>
                            <div className="font-bold text-red-800">{ausentesHoje}</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-sm text-muted-foreground py-2">
                        Nenhuma chamada registrada hoje
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedTurma && (
        <AttendanceHistory
          open={historyOpen}
          onOpenChange={setHistoryOpen}
          turmaId={selectedTurma.id}
          turmaNome={selectedTurma.nome}
        />
      )}
    </>
  );
};
