import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { presencasService, type Presenca } from '@/lib/services/presencasService';
import { turmasService, type Turma } from '@/lib/services/turmasService';
import { BatchAttendanceDialog } from '@/components/attendance/BatchAttendanceDialog';
import { IndividualAttendanceDialog } from '@/components/attendance/IndividualAttendanceDialog';
import { AttendanceStats } from '@/components/attendance/AttendanceStats';
import AttendanceStatistics from '@/components/attendance/AttendanceStatistics';
import { Calendar, Users, BarChart3, Plus, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { OfflineIndicator } from '@/components/offline/OfflineIndicator';

const Attendances: React.FC = () => {
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [individualDialogOpen, setIndividualDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Query para buscar presenças
  const { data: presencas = [], isLoading: presencasLoading } = useQuery({
    queryKey: ['presencas'],
    queryFn: presencasService.getAll,
  });

  // Query para buscar turmas
  const { data: turmas = [], isLoading: turmasLoading } = useQuery({
    queryKey: ['turmas'],
    queryFn: turmasService.getAll,
  });

  const handleUpdatePresenca = async (id: string, presente: boolean) => {
    try {
      await presencasService.updateStatus(id, presente);
      
      toast({
        title: 'Sucesso',
        description: `Presença ${presente ? 'confirmada' : 'removida'} com sucesso!`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['presencas'] });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a presença.',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePresenca = async (id: string) => {
    try {
      await presencasService.delete(id);
      
      toast({
        title: 'Sucesso',
        description: 'Registro de presença removido com sucesso!',
      });
      
      queryClient.invalidateQueries({ queryKey: ['presencas'] });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o registro.',
        variant: 'destructive',
      });
    }
  };

  const columns = [
    {
      accessorKey: 'aluno.nome',
      header: 'Aluno',
      cell: ({ row }: { row: any }) => {
        const presenca = row.original as Presenca;
        return (
          <div>
            <div className="font-medium">{presenca.aluno?.nome || 'N/A'}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'turma.nome',
      header: 'Turma',
      cell: ({ row }: { row: any }) => {
        const presenca = row.original as Presenca;
        return presenca.turma?.nome || 'N/A';
      },
    },
    {
      accessorKey: 'data_chamada',
      header: 'Data da Chamada',
      cell: ({ row }: { row: any }) => {
        const presenca = row.original as Presenca;
        const date = new Date(presenca.data_chamada);
        return date.toLocaleDateString('pt-BR');
      },
    },
    {
      accessorKey: 'presente',
      header: 'Status',
      cell: ({ row }: { row: any }) => {
        const presenca = row.original as Presenca;
        return (
          <Badge variant={presenca.presente ? 'default' : 'destructive'}>
            {presenca.presente ? 'Presente' : 'Ausente'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Registrado',
      cell: ({ row }: { row: any }) => {
        const presenca = row.original as Presenca;
        if (!presenca.created_at) return 'N/A';
        
        try {
          const date = new Date(presenca.created_at);
          return formatDistanceToNow(date, { 
            addSuffix: true, 
            locale: ptBR 
          });
        } catch {
          return 'Data inválida';
        }
      },
    },
    {
      accessorKey: 'usuario_email',
      header: 'Registrado por',
      cell: ({ row }: { row: any }) => {
        const presenca = row.original as Presenca;
        return presenca.usuario_email || 'N/A';
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }: { row: any }) => {
        const presenca = row.original as Presenca;
        return (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUpdatePresenca(presenca.id, !presenca.presente)}
            >
              {presenca.presente ? 'Marcar Falta' : 'Marcar Presença'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeletePresenca(presenca.id)}
            >
              Excluir
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gerenciar Chamadas</h1>
        <div className="flex gap-2">
          <Button onClick={() => setBatchDialogOpen(true)}>
            <Users className="h-4 w-4 mr-2" />
            Chamada em Lote
          </Button>
          <Button onClick={() => setIndividualDialogOpen(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Chamada Individual
          </Button>
        </div>
      </div>

      <OfflineIndicator />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Calendar className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="records">
            <Clock className="h-4 w-4 mr-2" />
            Registros
          </TabsTrigger>
          <TabsTrigger value="statistics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Estatísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo de Frequência por Turma</CardTitle>
            </CardHeader>
            <CardContent>
              {turmasLoading || presencasLoading ? (
                <div className="text-center py-8">Carregando dados...</div>
              ) : (
                <AttendanceStats turmas={turmas} presencas={presencas} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registros de Chamada</CardTitle>
            </CardHeader>
            <CardContent>
              {presencasLoading ? (
                <div className="text-center py-8">Carregando registros...</div>
              ) : (
                <DataTable
                  columns={columns}
                  data={presencas}
                  filterPlaceholder="Buscar por aluno ou turma..."
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <AttendanceStatistics />
        </TabsContent>
      </Tabs>

      <BatchAttendanceDialog 
        open={batchDialogOpen}
        onOpenChange={setBatchDialogOpen}
      />

      <IndividualAttendanceDialog 
        open={individualDialogOpen}
        onOpenChange={setIndividualDialogOpen}
      />
    </div>
  );
};

export default Attendances;
