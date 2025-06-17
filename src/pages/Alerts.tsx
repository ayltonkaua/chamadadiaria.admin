
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { alunosService } from '@/lib/services/alunosService';
import { turmasService, Turma } from '@/lib/services/turmasService';
import StudentProfileModal from '@/components/students/StudentProfileModal';
import AlertsHeader from '@/components/alerts/AlertsHeader';
import AlertsFilters from '@/components/alerts/AlertsFilters';
import AlertsTable from '@/components/alerts/AlertsTable';
import TurmasStatsGrid from '@/components/alerts/TurmasStatsGrid';
import TopStudentsModal from '@/components/alerts/TopStudentsModal';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface AlunoFaltoso {
  aluno_id: string;
  aluno_nome: string;
  matricula: string;
  total_faltas: number;
  turma_id: string;
  turma_nome: string;
  percentual_faltas?: number;
}

const Alerts: React.FC = () => {
  const [alunosFaltosos, setAlunosFaltosos] = useState<AlunoFaltoso[]>([]);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [limiarFaltas, setLimiarFaltas] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [topStudentsModalOpen, setTopStudentsModalOpen] = useState(false);
  const [selectedTurmaStats, setSelectedTurmaStats] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [limiarFaltas]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const turmasData = await turmasService.getAll();
      setTurmas(turmasData);
      
      const faltososData = await alunosService.getAlunosFaltosos(limiarFaltas);
      setAlunosFaltosos(faltososData);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao carregar os alertas.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const exportarParaExcel = () => {
    try {
      const dadosParaExportar = alunosFaltosos.map(aluno => ({
        'Matrícula': aluno.matricula,
        'Nome do Aluno': aluno.aluno_nome,
        'Turma': aluno.turma_nome,
        'Total de Faltas': aluno.total_faltas,
        'Percentual de Faltas': aluno.percentual_faltas ? `${aluno.percentual_faltas.toFixed(1)}%` : 'N/A'
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dadosParaExportar);
      XLSX.utils.book_append_sheet(wb, ws, 'Alunos Faltosos');

      const dataAtual = format(new Date(), 'yyyy-MM-dd_HH-mm');
      const nomeArquivo = `alertas_faltas_${limiarFaltas}_ou_mais_${dataAtual}.xlsx`;
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

  const viewStudentProfile = async (alunoId: string) => {
    try {
      const aluno = await alunosService.getById(alunoId);
      setSelectedStudent(aluno);
      setProfileModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar aluno:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o perfil do aluno.',
        variant: 'destructive'
      });
    }
  };

  const handleViewTopStudents = (turmaStats: any) => {
    setSelectedTurmaStats(turmaStats);
    setTopStudentsModalOpen(true);
  };

  const estatisticasPorTurma = turmas.map(turma => {
    const alunosDaTurma = alunosFaltosos.filter(a => a.turma_id === turma.id);
    return {
      id: turma.id,
      nome: turma.nome,
      total_alunos_faltosos: alunosDaTurma.length,
      media_faltas: alunosDaTurma.length > 0
        ? alunosDaTurma.reduce((sum, a) => sum + a.total_faltas, 0) / alunosDaTurma.length
        : 0,
      alunos: alunosDaTurma
    };
  });

  return (
    <div className="space-y-6">
      <AlertsHeader />

      <AlertsFilters
        limiarFaltas={limiarFaltas}
        onLimiarChange={setLimiarFaltas}
        onExport={exportarParaExcel}
        loading={loading}
        totalAlunos={alunosFaltosos.length}
      />

      <Tabs defaultValue="alunos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alunos">Lista de Alunos</TabsTrigger>
          <TabsTrigger value="turmas">Estatísticas por Turma</TabsTrigger>
        </TabsList>
        
        <TabsContent value="alunos">
          <AlertsTable
            alunosFaltosos={alunosFaltosos}
            loading={loading}
            limiarFaltas={limiarFaltas}
            onViewProfile={viewStudentProfile}
          />
        </TabsContent>
        
        <TabsContent value="turmas">
          <TurmasStatsGrid
            estatisticas={estatisticasPorTurma}
            limiarFaltas={limiarFaltas}
            onViewTopStudents={handleViewTopStudents}
          />
        </TabsContent>
      </Tabs>

      <StudentProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        student={selectedStudent}
      />

      <TopStudentsModal
        open={topStudentsModalOpen}
        onOpenChange={setTopStudentsModalOpen}
        turmaStats={selectedTurmaStats}
        onViewProfile={viewStudentProfile}
      />
    </div>
  );
};

export default Alerts;
