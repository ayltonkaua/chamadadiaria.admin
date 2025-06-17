import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

interface TurmaStatistics {
  id: string;
  nome: string;
  numero_sala: string;
  total_alunos: number;
  total_chamadas: number;
  presencas: number;
  faltas: number;
  taxa_presenca: number;
  taxa_falta: number;
}

const AttendanceStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<TurmaStatistics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Buscar todas as turmas
        const { data: turmas, error: turmasError } = await supabase
          .from('turmas')
          .select('id, nome, numero_sala');

        if (turmasError) throw turmasError;

        // Para cada turma, calcular estatísticas
        const turmaStats = await Promise.all(
          (turmas || []).map(async (turma) => {
            // Buscar total de alunos na turma
            const { data: alunos, error: alunosError } = await supabase
              .from('alunos')
              .select('id')
              .eq('turma_id', turma.id);

            if (alunosError) throw alunosError;

            // Buscar todas as presenças da turma
            const { data: presencas, error: presencasError } = await supabase
              .from('presencas')
              .select('presente')
              .eq('turma_id', turma.id);

            if (presencasError) throw presencasError;

            const totalAlunos = alunos?.length || 0;
            const totalChamadas = presencas?.length || 0;
            const totalPresencas = presencas?.filter(p => p.presente).length || 0;
            const totalFaltas = totalChamadas - totalPresencas;
            
            const taxaPresenca = totalChamadas > 0 ? (totalPresencas / totalChamadas) * 100 : 0;
            const taxaFalta = totalChamadas > 0 ? (totalFaltas / totalChamadas) * 100 : 0;

            return {
              id: turma.id,
              nome: turma.nome,
              numero_sala: turma.numero_sala,
              total_alunos: totalAlunos,
              total_chamadas: totalChamadas,
              presencas: totalPresencas,
              faltas: totalFaltas,
              taxa_presenca: taxaPresenca,
              taxa_falta: taxaFalta
            };
          })
        );

        setStatistics(turmaStats);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Função para exportar dados detalhados de uma turma para Excel
  const exportarTurmaParaExcel = async (turmaId: string, turmaNome: string) => {
    try {
      // Buscar alunos da turma
      const { data: alunos, error: alunosError } = await supabase
        .from('alunos')
        .select('id, nome, matricula')
        .eq('turma_id', turmaId);

      if (alunosError) throw alunosError;

      // Buscar presenças da turma
      const { data: presencas, error: presencasError } = await supabase
        .from('presencas')
        .select('aluno_id, data_chamada, presente')
        .eq('turma_id', turmaId);

      if (presencasError) throw presencasError;

      // Buscar atestados dos alunos da turma
      const alunosIds = alunos?.map(a => a.id) || [];
      const { data: atestados, error: atestadosError } = await supabase
        .from('atestados')
        .select('aluno_id, data_inicio, data_fim, descricao')
        .in('aluno_id', alunosIds);

      if (atestadosError) throw atestadosError;

      // Preparar dados para exportação
      const dadosParaExportar = (alunos || []).map(aluno => {
        // Filtrar presenças do aluno
        const presencasAluno = (presencas || []).filter(p => p.aluno_id === aluno.id);
        
        // Contar faltas por mês
        const faltasPorMes: { [key: string]: number } = {};
        const meses = [
          'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
          'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        
        meses.forEach(mes => {
          faltasPorMes[mes] = 0;
        });

        presencasAluno.forEach(presenca => {
          if (!presenca.presente) {
            const data = new Date(presenca.data_chamada);
            const mesIndex = data.getMonth();
            const mesNome = meses[mesIndex];
            faltasPorMes[mesNome]++;
          }
        });

        // Buscar atestados do aluno
        const atestadosAluno = (atestados || []).filter(a => a.aluno_id === aluno.id);
        const motivosAtestados = atestadosAluno.map(a => a.descricao).join('; ') || 'Nenhum';

        return {
          'Matrícula': aluno.matricula,
          'Nome': aluno.nome,
          'Janeiro': faltasPorMes['Janeiro'],
          'Fevereiro': faltasPorMes['Fevereiro'],
          'Março': faltasPorMes['Março'],
          'Abril': faltasPorMes['Abril'],
          'Maio': faltasPorMes['Maio'],
          'Junho': faltasPorMes['Junho'],
          'Julho': faltasPorMes['Julho'],
          'Agosto': faltasPorMes['Agosto'],
          'Setembro': faltasPorMes['Setembro'],
          'Outubro': faltasPorMes['Outubro'],
          'Novembro': faltasPorMes['Novembro'],
          'Dezembro': faltasPorMes['Dezembro'],
          'Motivos de Atestados': motivosAtestados
        };
      });

      // Criar workbook e worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dadosParaExportar);

      // Adicionar worksheet ao workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Dados da Turma');

      // Gerar nome do arquivo com data atual
      const dataAtual = format(new Date(), 'yyyy-MM-dd_HH-mm');
      const nomeArquivo = `turma_${turmaNome.replace(/\s+/g, '_')}_${dataAtual}.xlsx`;

      // Fazer download do arquivo
      XLSX.writeFile(wb, nomeArquivo);

      toast({
        title: 'Exportação realizada',
        description: `Dados da turma ${turmaNome} exportados com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao exportar dados da turma:', error);
      toast({
        title: 'Erro na exportação',
        description: 'Ocorreu um erro ao exportar os dados da turma.',
        variant: 'destructive'
      });
    }
  };

  // Dados para o gráfico de barras
  const chartData = statistics.map(stat => ({
    nome: stat.nome,
    Presenças: stat.presencas,
    Faltas: stat.faltas,
    'Taxa Presença': parseFloat(stat.taxa_presenca.toFixed(1))
  }));

  // Dados para o gráfico de pizza (totais gerais)
  const totalPresencas = statistics.reduce((sum, stat) => sum + stat.presencas, 0);
  const totalFaltas = statistics.reduce((sum, stat) => sum + stat.faltas, 0);
  
  const pieData = [
    { name: 'Presenças', value: totalPresencas, color: '#22c55e' },
    { name: 'Faltas', value: totalFaltas, color: '#ef4444' }
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Estatísticas de Frequência</h2>
        <Badge variant="outline">
          {statistics.length} turma{statistics.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics.reduce((sum, stat) => sum + stat.total_alunos, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Presenças</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPresencas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Faltas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalFaltas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Presenças vs Faltas por Turma</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nome" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Presenças" fill="#22c55e" />
                <Bar dataKey="Faltas" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabela detalhada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhes por Turma</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statistics.map((stat) => (
              <div key={stat.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{stat.nome}</h3>
                    <p className="text-sm text-muted-foreground">Sala: {stat.numero_sala}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {stat.total_alunos} aluno{stat.total_alunos !== 1 ? 's' : ''}
                    </Badge>
                    <Button
                      onClick={() => exportarTurmaParaExcel(stat.id, stat.nome)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Exportar Excel
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Chamadas</div>
                    <div className="font-medium">{stat.total_chamadas}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Presenças</div>
                    <div className="font-medium text-green-600">{stat.presencas}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Faltas</div>
                    <div className="font-medium text-red-600">{stat.faltas}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Taxa de Presença</div>
                    <div className="font-medium">
                      <Badge 
                        variant={stat.taxa_presenca >= 80 ? "default" : stat.taxa_presenca >= 60 ? "secondary" : "destructive"}
                      >
                        {stat.taxa_presenca.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Barra de progresso visual */}
                <div className="mt-3">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-1">
                    <span>Taxa de Presença</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: `${stat.taxa_presenca}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceStatistics;
