
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AlunoFaltoso {
  aluno_id: string;
  aluno_nome: string;
  matricula: string;
  total_faltas: number;
  turma_id: string;
  turma_nome: string;
  percentual_faltas?: number;
}

interface AlertsTableProps {
  alunosFaltosos: AlunoFaltoso[];
  loading: boolean;
  limiarFaltas: number;
  onViewProfile: (alunoId: string) => void;
}

const AlertsTable: React.FC<AlertsTableProps> = ({
  alunosFaltosos,
  loading,
  limiarFaltas,
  onViewProfile
}) => {
  const columns: ColumnDef<AlunoFaltoso>[] = [
    {
      accessorKey: 'matricula',
      header: 'Matrícula',
    },
    {
      accessorKey: 'aluno_nome',
      header: 'Nome',
    },
    {
      accessorKey: 'turma_nome',
      header: 'Turma',
    },
    {
      accessorKey: 'total_faltas',
      header: 'Faltas',
      cell: ({ row }) => {
        const count = row.getValue('total_faltas') as number;
        return (
          <Badge variant={count >= 8 ? "destructive" : count >= 5 ? "secondary" : "outline"}>
            {count} faltas
          </Badge>
        );
      },
    },
    {
      id: 'acoes',
      header: 'Ações',
      cell: ({ row }) => {
        return (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewProfile(row.original.aluno_id)}
          >
            <User className="h-4 w-4 mr-2" />
            Perfil
          </Button>
        );
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alunos com {limiarFaltas} ou mais faltas</CardTitle>
        <CardDescription>
          Lista de alunos que precisam de atenção devido ao número de faltas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">Carregando alertas...</div>
        ) : alunosFaltosos.length > 0 ? (
          <DataTable
            columns={columns}
            data={alunosFaltosos}
            filterPlaceholder="Buscar aluno..."
          />
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-lg font-medium">Nenhum alerta encontrado</p>
            <p className="text-muted-foreground">
              Todos os alunos estão com frequência regular.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground border-t pt-4">
        Última atualização: {format(new Date(), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR })}
      </CardFooter>
    </Card>
  );
};

export default AlertsTable;
