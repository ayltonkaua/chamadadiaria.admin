import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, FileText, Plus, Phone, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { presencasService, Presenca } from '@/lib/services/presencasService';
import { Aluno } from '@/lib/services/alunosService';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import AddObservationDialog from './AddObservationDialog';
import AddAtestadoDialog from './AddAtestadoDialog';
import AddContactDialog from './AddContactDialog';
import EditObservationDialog from './EditObservationDialog';
import EditAtestadoDialog from './EditAtestadoDialog';
import EditContactDialog from './EditContactDialog';
import JustifyAbsenceDialog from './JustifyAbsenceDialog';
import EditAttendanceDialog from './EditAttendanceDialog';

interface StudentProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Aluno | null;
}

type Atestado = {
  id: string;
  data_inicio: string;
  data_fim: string;
  descricao: string;
  status: string;
  created_at: string;
};

type Observacao = {
  id: string;
  titulo: string;
  descricao: string;
  created_at: string;
};

type RegistroContato = {
  id: string;
  data_contato: string;
  forma_contato: string;
  justificativa_faltas: string;
  link_arquivo: string | null;
  monitor_responsavel: string;
  created_at: string;
};

const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  open,
  onOpenChange,
  student
}) => {
  const [presencas, setPresencas] = useState<Presenca[]>([]);
  const [atestados, setAtestados] = useState<Atestado[]>([]);
  const [observacoes, setObservacoes] = useState<Observacao[]>([]);
  const [registrosContato, setRegistrosContato] = useState<RegistroContato[]>([]);
  const [loading, setLoading] = useState(false);
  const [observationDialogOpen, setObservationDialogOpen] = useState(false);
  const [atestadoDialogOpen, setAtestadoDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [editObservationDialogOpen, setEditObservationDialogOpen] = useState(false);
  const [editAtestadoDialogOpen, setEditAtestadoDialogOpen] = useState(false);
  const [editContactDialogOpen, setEditContactDialogOpen] = useState(false);
  const [justifyAbsenceDialogOpen, setJustifyAbsenceDialogOpen] = useState(false);
  const [selectedObservacao, setSelectedObservacao] = useState<Observacao | null>(null);
  const [selectedAtestado, setSelectedAtestado] = useState<Atestado | null>(null);
  const [selectedContato, setSelectedContato] = useState<RegistroContato | null>(null);
  const [selectedPresenca, setSelectedPresenca] = useState<any>(null);
  const [editAttendanceDialogOpen, setEditAttendanceDialogOpen] = useState(false);
  const [selectedPresencaForEdit, setSelectedPresencaForEdit] = useState<any>(null);

  useEffect(() => {
    if (open && student) {
      fetchStudentData();
    }
  }, [open, student]);

  const fetchStudentData = async () => {
    if (!student) return;

    setLoading(true);
    try {
      const { data: presencasData, error: presencasError } = await supabase
        .from('presencas')
        .select(`
          *,
          aluno:aluno_id (id, nome),
          justificativas_faltas (id, motivo)
        `)
        .eq('aluno_id', student.id)
        .order('data_chamada', { ascending: false });

      if (presencasError) throw presencasError;
      
      const presencasFormatadas = (presencasData || []).map((presenca: any) => ({
        ...presenca,
        justificativa: presenca.justificativas_faltas?.[0] || null
      }));
      
      setPresencas(presencasFormatadas);

      const { data: atestadosData, error: atestadosError } = await supabase
        .from('atestados')
        .select('*')
        .eq('aluno_id', student.id)
        .order('created_at', { ascending: false });

      if (atestadosError) throw atestadosError;
      setAtestados(atestadosData || []);

      const { data: observacoesData, error: observacoesError } = await supabase
        .from('observacoes_alunos')
        .select('*')
        .eq('aluno_id', student.id)
        .order('created_at', { ascending: false });

      if (observacoesError) throw observacoesError;
      setObservacoes(observacoesData || []);

      const { data: registrosContatoData, error: registrosContatoError } = await supabase
        .from('registros_contato_busca_ativa')
        .select('*')
        .eq('aluno_id', student.id)
        .order('created_at', { ascending: false });

      if (registrosContatoError) throw registrosContatoError;
      setRegistrosContato(registrosContatoData || []);

    } catch (error) {
      console.error('Erro ao carregar dados do aluno:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteObservacao = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta observação?')) return;

    try {
      const { error } = await supabase
        .from('observacoes_alunos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Observação excluída',
        description: 'A observação foi excluída com sucesso.',
      });

      fetchStudentData();
    } catch (error) {
      console.error('Erro ao excluir observação:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir a observação.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAtestado = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este atestado?')) return;

    try {
      const { error } = await supabase
        .from('atestados')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Atestado excluído',
        description: 'O atestado foi excluído com sucesso.',
      });

      fetchStudentData();
    } catch (error) {
      console.error('Erro ao excluir atestado:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o atestado.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteContato = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro de contato?')) return;

    try {
      const { error } = await supabase
        .from('registros_contato_busca_ativa')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Registro excluído',
        description: 'O registro de contato foi excluído com sucesso.',
      });

      fetchStudentData();
    } catch (error) {
      console.error('Erro ao excluir registro:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o registro de contato.',
        variant: 'destructive'
      });
    }
  };

  const faltas = presencas.filter(p => !p.presente);
  const faltasJustificadas = presencas.filter(p => !p.presente && p.falta_justificada);
  const faltasNaoJustificadas = presencas.filter(p => !p.presente && !p.falta_justificada);
  const presencasCount = presencas.filter(p => p.presente);
  const totalRegistros = presencas.length;
  const percentualPresenca = totalRegistros > 0 ? (presencasCount.length / totalRegistros) * 100 : 0;
  const percentualFalta = totalRegistros > 0 ? (faltas.length / totalRegistros) * 100 : 0;

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
      'pendente': 'secondary',
      'aprovado': 'default',
      'rejeitado': 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (!student) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Aluno - {student.nome}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Nome:</strong> {student.nome}</p>
                    <p><strong>Matrícula:</strong> {student.matricula}</p>
                  </div>
                  <div>
                    <p><strong>Taxa de Presença:</strong> {percentualPresenca.toFixed(1)}% ({presencasCount.length} presenças)</p>
                    <p><strong>Taxa de Falta:</strong> {percentualFalta.toFixed(1)}% ({faltas.length} faltas)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="presencas" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="presencas">Presenças</TabsTrigger>
                <TabsTrigger value="faltas">Faltas</TabsTrigger>
                <TabsTrigger value="faltas-justificadas">Faltas Justificadas</TabsTrigger>
                <TabsTrigger value="atestados">Atestados</TabsTrigger>
                <TabsTrigger value="observacoes">Observações</TabsTrigger>
                <TabsTrigger value="contatos">Contatos</TabsTrigger>
              </TabsList>

              <TabsContent value="presencas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Registro de Presenças ({presencasCount.length} - {percentualPresenca.toFixed(1)}%)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p>Carregando...</p>
                    ) : presencasCount.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                        {presencasCount.map((presenca) => (
                          <div key={presenca.id} className="p-2 border rounded-md bg-green-50 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">
                                {format(new Date(presenca.data_chamada), 'dd/MM/yyyy', { locale: ptBR })}
                              </p>
                              <Badge variant="default" className="text-xs">Presente</Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                console.log('Editando presença:', presenca);
                                setSelectedPresencaForEdit({
                                  ...presenca,
                                  aluno: presenca.aluno || { nome: student.nome }
                                });
                                setEditAttendanceDialogOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhuma presença registrada</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="faltas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Registro de Faltas Não Justificadas ({faltasNaoJustificadas.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p>Carregando...</p>
                    ) : faltasNaoJustificadas.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                        {faltasNaoJustificadas.map((falta) => (
                          <div key={falta.id} className="p-2 border rounded-md bg-red-50 flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium">
                                {format(new Date(falta.data_chamada), 'dd/MM/yyyy', { locale: ptBR })}
                              </p>
                              <Badge variant="destructive" className="text-xs">Falta</Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPresenca(falta);
                                  setJustifyAbsenceDialogOpen(true);
                                }}
                              >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Justificar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  console.log('Editando falta:', falta);
                                  setSelectedPresencaForEdit({
                                    ...falta,
                                    aluno: falta.aluno || { nome: student.nome }
                                  });
                                  setEditAttendanceDialogOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhuma falta não justificada registrada</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="faltas-justificadas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Faltas Justificadas ({faltasJustificadas.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <p>Carregando...</p>
                    ) : faltasJustificadas.length > 0 ? (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {faltasJustificadas.map((falta) => (
                          <div key={falta.id} className="p-3 border rounded-md bg-yellow-50">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {format(new Date(falta.data_chamada), 'dd/MM/yyyy', { locale: ptBR })}
                                </p>
                                <Badge variant="secondary" className="text-xs">Falta Justificada</Badge>
                                {falta.justificativa && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    <strong>Motivo:</strong> {falta.justificativa.motivo}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  console.log('Editando falta justificada:', falta);
                                  setSelectedPresencaForEdit({
                                    ...falta,
                                    aluno: falta.aluno || { nome: student.nome }
                                  });
                                  setEditAttendanceDialogOpen(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhuma falta justificada registrada</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="atestados" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Atestados ({atestados.length})
                    </CardTitle>
                    <CardDescription>
                      Histórico de atestados médicos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mb-4"
                      onClick={() => setAtestadoDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Atestado
                    </Button>
                    
                    {loading ? (
                      <p>Carregando...</p>
                    ) : atestados.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {atestados.map((atestado) => (
                          <div key={atestado.id} className="p-3 border rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-medium">
                                  {format(new Date(atestado.data_inicio), 'dd/MM/yyyy', { locale: ptBR })} - {format(new Date(atestado.data_fim), 'dd/MM/yyyy', { locale: ptBR })}
                                </p>
                                <p className="text-sm text-muted-foreground">{atestado.descricao}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(atestado.status)}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAtestado(atestado);
                                    setEditAtestadoDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteAtestado(atestado.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Registrado em: {format(new Date(atestado.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhum atestado registrado</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="observacoes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Observações ({observacoes.length})</CardTitle>
                    <CardDescription>
                      Observações e informações importantes sobre o aluno
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="mb-4"
                      onClick={() => setObservationDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Observação
                    </Button>
                    
                    {loading ? (
                      <p>Carregando...</p>
                    ) : observacoes.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {observacoes.map((observacao) => (
                          <div key={observacao.id} className="p-3 border rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-medium">{observacao.titulo}</p>
                                <p className="text-sm text-muted-foreground">{observacao.descricao}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedObservacao(observacao);
                                    setEditObservationDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteObservacao(observacao.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Registrado em: {format(new Date(observacao.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhuma observação registrada</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contatos" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className="h-5 w-5" />
                      Registros de Contato - Busca Ativa ({registrosContato.length})
                    </CardTitle>
                    <CardDescription>
                      Histórico de contatos realizados pelos monitores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="mb-4"
                      onClick={() => setContactDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Registro de Contato
                    </Button>
                    
                    {loading ? (
                      <p>Carregando...</p>
                    ) : registrosContato.length > 0 ? (
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {registrosContato.map((registro) => (
                          <div key={registro.id} className="p-3 border rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <p className="font-medium">
                                    Contato em {format(new Date(registro.data_contato), 'dd/MM/yyyy', { locale: ptBR })}
                                  </p>
                                  <Badge variant="outline">{registro.forma_contato}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  <strong>Justificativa:</strong> {registro.justificativa_faltas}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  <strong>Monitor:</strong> {registro.monitor_responsavel}
                                </p>
                                {registro.link_arquivo && (
                                  <p className="text-sm">
                                    <strong>Arquivo:</strong> 
                                    <a 
                                      href={registro.link_arquivo} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline ml-1"
                                    >
                                      Ver arquivo
                                    </a>
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedContato(registro);
                                    setEditContactDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteContato(registro.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Registrado em: {format(new Date(registro.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhum registro de contato encontrado</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>

      <AddObservationDialog
        open={observationDialogOpen}
        onOpenChange={setObservationDialogOpen}
        studentId={student?.id || ''}
        onObservationAdded={fetchStudentData}
      />

      <AddAtestadoDialog
        open={atestadoDialogOpen}
        onOpenChange={setAtestadoDialogOpen}
        studentId={student?.id || ''}
        onAtestadoAdded={fetchStudentData}
      />

      <AddContactDialog
        open={contactDialogOpen}
        onOpenChange={setContactDialogOpen}
        studentId={student?.id || ''}
        onContactAdded={fetchStudentData}
      />

      <EditObservationDialog
        open={editObservationDialogOpen}
        onOpenChange={setEditObservationDialogOpen}
        observacao={selectedObservacao}
        onObservationUpdated={fetchStudentData}
      />

      <EditAtestadoDialog
        open={editAtestadoDialogOpen}
        onOpenChange={setEditAtestadoDialogOpen}
        atestado={selectedAtestado}
        onAtestadoUpdated={fetchStudentData}
      />

      <EditContactDialog
        open={editContactDialogOpen}
        onOpenChange={setEditContactDialogOpen}
        contato={selectedContato}
        onContactUpdated={fetchStudentData}
      />

      <JustifyAbsenceDialog
        open={justifyAbsenceDialogOpen}
        onOpenChange={setJustifyAbsenceDialogOpen}
        presenca={selectedPresenca}
        onAbsenceJustified={fetchStudentData}
      />

      <EditAttendanceDialog
        open={editAttendanceDialogOpen}
        onOpenChange={setEditAttendanceDialogOpen}
        presenca={selectedPresencaForEdit}
        onAttendanceUpdated={fetchStudentData}
      />
    </>
  );
};

export default StudentProfileModal;
