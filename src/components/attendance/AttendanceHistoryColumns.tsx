
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AttendanceHistoryColumnsProps {
  onUpdatePresenca: (id: string, presente: boolean) => void;
  onDeletePresenca: (id: string) => void;
}

export const createAttendanceHistoryColumns = ({ 
  onUpdatePresenca, 
  onDeletePresenca 
}: AttendanceHistoryColumnsProps) => [
  {
    accessorKey: 'aluno.nome',
    header: 'Aluno',
    cell: ({ row }: { row: any }) => {
      const presenca = row.original as any;
      return (
        <div>
          <div className="font-medium">{presenca.aluno?.nome || 'N/A'}</div>
          <div className="text-sm text-muted-foreground">{presenca.aluno?.matricula || 'N/A'}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'data_chamada',
    header: 'Data da Chamada',
    cell: ({ row }: { row: any }) => {
      const presenca = row.original as any;
      const date = new Date(presenca.data_chamada);
      return date.toLocaleDateString('pt-BR');
    },
  },
  {
    accessorKey: 'presente',
    header: 'Status',
    cell: ({ row }: { row: any }) => {
      const presenca = row.original as any;
      
      if (presenca.presente) {
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">Presente</Badge>;
      }
      
      if (presenca.falta_justificada) {
        return (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600">Falta Justificada</Badge>
            {presenca.justificativa && (
              <div className="group relative">
                <FileText className="h-4 w-4 text-blue-500 cursor-help" />
                <div className="absolute bottom-6 left-0 hidden group-hover:block bg-black text-white text-xs rounded p-2 whitespace-nowrap z-10 max-w-xs">
                  {presenca.justificativa.motivo}
                </div>
              </div>
            )}
          </div>
        );
      }
      
      return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">Faltou</Badge>;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Registrado',
    cell: ({ row }: { row: any }) => {
      const presenca = row.original as any;
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
    id: 'actions',
    header: 'Ações',
    cell: ({ row }: { row: any }) => {
      const presenca = row.original as any;
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdatePresenca(presenca.id, !presenca.presente)}
          >
            <Edit className="h-4 w-4 mr-1" />
            {presenca.presente ? 'Marcar Falta' : 'Marcar Presença'}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeletePresenca(presenca.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Excluir
          </Button>
        </div>
      );
    },
  },
];
