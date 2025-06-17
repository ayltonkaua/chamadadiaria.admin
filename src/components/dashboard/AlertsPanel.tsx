
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Clock, UserX } from 'lucide-react';

interface Alert {
  tipo: 'frequencia_baixa' | 'faltas_consecutivas' | 'sem_chamada';
  aluno_nome: string;
  matricula: string;
  turma_nome: string;
  detalhes: string;
  prioridade: 'alta' | 'media' | 'baixa';
}

interface AlertsPanelProps {
  alertas: Alert[];
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alertas }) => {
  const getAlertIcon = (tipo: Alert['tipo']) => {
    switch (tipo) {
      case 'frequencia_baixa': return <UserX className="h-4 w-4" />;
      case 'sem_chamada': return <Clock className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertTitle = (tipo: Alert['tipo']) => {
    switch (tipo) {
      case 'frequencia_baixa': return 'Frequência Baixa';
      case 'sem_chamada': return 'Sem Chamada';
      default: return 'Alerta';
    }
  };

  const getPriorityColor = (prioridade: Alert['prioridade']) => {
    switch (prioridade) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      default: return 'secondary';
    }
  };

  if (alertas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            🎉 Nenhum alerta no momento! Tudo funcionando bem.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas do Sistema
          <Badge variant="destructive">{alertas.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alertas.slice(0, 5).map((alerta, index) => (
            <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
              <div className="flex-shrink-0">
                {getAlertIcon(alerta.tipo)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {getAlertTitle(alerta.tipo)}
                  </span>
                  <Badge variant={getPriorityColor(alerta.prioridade)} className="text-xs">
                    {alerta.prioridade.toUpperCase()}
                  </Badge>
                </div>
                {alerta.aluno_nome && (
                  <p className="text-sm">
                    <span className="font-medium">{alerta.aluno_nome}</span>
                    {alerta.matricula && ` (${alerta.matricula})`}
                    {alerta.turma_nome && ` - ${alerta.turma_nome}`}
                  </p>
                )}
                {!alerta.aluno_nome && alerta.turma_nome && (
                  <p className="text-sm font-medium">{alerta.turma_nome}</p>
                )}
                <p className="text-xs text-muted-foreground">{alerta.detalhes}</p>
              </div>
            </div>
          ))}
          {alertas.length > 5 && (
            <p className="text-xs text-muted-foreground text-center pt-2">
              +{alertas.length - 5} alertas adicionais
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
