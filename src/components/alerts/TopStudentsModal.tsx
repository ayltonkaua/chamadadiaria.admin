
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface TopStudentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turmaStats: {
    id: string;
    nome: string;
    alunos: Array<{
      aluno_id: string;
      aluno_nome: string;
      matricula: string;
      total_faltas: number;
    }>;
  } | null;
  onViewProfile: (alunoId: string) => void;
}

const TopStudentsModal: React.FC<TopStudentsModalProps> = ({
  open,
  onOpenChange,
  turmaStats,
  onViewProfile
}) => {
  const exportarParaExcel = () => {
    if (!turmaStats) return;

    try {
      const alunosOrdenados = turmaStats.alunos
        .sort((a, b) => b.total_faltas - a.total_faltas)
        .slice(0, 10);

      const dadosParaExportar = alunosOrdenados.map((aluno, index) => ({
        'Posição': index + 1,
        'Matrícula': aluno.matricula,
        'Nome do Aluno': aluno.aluno_nome,
        'Total de Faltas': aluno.total_faltas
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dadosParaExportar);

      XLSX.utils.book_append_sheet(wb, ws, 'Top 10 Faltosos');

      const dataAtual = format(new Date(), 'yyyy-MM-dd_HH-mm');
      const nomeArquivo = `top_10_faltosos_${turmaStats.nome.replace(/\s+/g, '_')}_${dataAtual}.xlsx`;

      XLSX.writeFile(wb, nomeArquivo);

      toast({
        title: 'Exportação realizada',
        description: `Arquivo ${nomeArquivo} foi baixado com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao exportar:', error);
      toast({
        title: 'Erro na exportação',
        description: 'Ocorreu um erro ao exportar os dados para Excel.',
        variant: 'destructive'
      });
    }
  };

  if (!turmaStats) return null;

  const alunosOrdenados = turmaStats.alunos
    .sort((a, b) => b.total_faltas - a.total_faltas)
    .slice(0, 10);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Top 10 Alunos com Mais Faltas - {turmaStats.nome}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={exportarParaExcel} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar Excel
            </Button>
          </div>
          
          <div className="space-y-2">
            {alunosOrdenados.map((aluno, index) => (
              <div key={aluno.aluno_id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-full">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{aluno.aluno_nome}</p>
                    <p className="text-sm text-muted-foreground">Matrícula: {aluno.matricula}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={aluno.total_faltas >= 8 ? "destructive" : "secondary"}>
                    {aluno.total_faltas} faltas
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onViewProfile(aluno.aluno_id);
                      onOpenChange(false);
                    }}
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {alunosOrdenados.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Nenhum aluno encontrado</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopStudentsModal;
