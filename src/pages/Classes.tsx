import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, Plus, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { turmasService, Turma } from '@/lib/services/turmasService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import ClassStudentsModal from '@/components/classes/ClassStudentsModal';

const Classes: React.FC = () => {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTurma, setCurrentTurma] = useState<Partial<Turma>>({});
  const { user } = useAuth();
  const [studentsModalOpen, setStudentsModalOpen] = useState(false);
  const [selectedTurmaForStudents, setSelectedTurmaForStudents] = useState<Turma | null>(null);

  // Carregar turmas
  useEffect(() => {
    const fetchTurmas = async () => {
      setLoading(true);
      try {
        const data = await turmasService.getAll();
        setTurmas(data);
      } catch (error) {
        console.error("Erro ao carregar turmas:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTurmas();
  }, []);
  
  // Salvar turma
  const saveTurma = async () => {
    try {
      if (!currentTurma.nome || !currentTurma.numero_sala) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos obrigatórios.',
          variant: 'destructive',
        });
        return;
      }
      
      setLoading(true);
      
      if (isEditing && currentTurma.id) {
        // Atualizar turma
        const updatedTurma = await turmasService.update(
          currentTurma.id, 
          {
            nome: currentTurma.nome,
            numero_sala: currentTurma.numero_sala
          }
        );
        
        setTurmas(prev => prev.map(t => t.id === updatedTurma.id ? {
          ...updatedTurma,
          usuario_email: currentTurma.usuario_email || 'Não atribuído'
        } : t));
        
        toast({
          title: 'Turma atualizada',
          description: 'Dados da turma atualizados com sucesso.',
        });
      } else {
        // Criar nova turma
        const newTurma = await turmasService.create({
          nome: currentTurma.nome,
          numero_sala: currentTurma.numero_sala
        });
        
        setTurmas(prev => [...prev, {
          ...newTurma,
          usuario_email: user?.email || 'Não atribuído'
        }]);
        
        toast({
          title: 'Turma adicionada',
          description: 'Nova turma cadastrada com sucesso.',
        });
      }
      
      setDialogOpen(false);
      setCurrentTurma({});
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Excluir turma
  const deleteTurma = async (id: string) => {
    try {
      if (confirm('Tem certeza que deseja excluir esta turma? Isso também excluirá todas as presenças relacionadas.')) {
        await turmasService.delete(id);
        setTurmas(prev => prev.filter(t => t.id !== id));
        
        toast({
          title: 'Turma excluída',
          description: 'Turma removida com sucesso.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  // Editar turma
  const editTurma = (turma: Turma) => {
    setCurrentTurma(turma);
    setIsEditing(true);
    setDialogOpen(true);
  };
  
  // Adicionar nova turma
  const addNewTurma = () => {
    setCurrentTurma({});
    setIsEditing(false);
    setDialogOpen(true);
  };

  // Visualizar alunos da turma
  const viewTurmaStudents = (turma: Turma) => {
    setSelectedTurmaForStudents(turma);
    setStudentsModalOpen(true);
  };
  
  // Definir colunas da tabela
  const columns: ColumnDef<Turma>[] = [
    {
      accessorKey: 'nome',
      header: 'Nome',
    },
    {
      accessorKey: 'numero_sala',
      header: 'Número da Sala',
    },
    {
      accessorKey: 'usuario_email',
      header: 'Cadastrado por',
      cell: ({ row }) => {
        const email = row.original.usuario_email || 'Não atribuído';
        return (
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{email}</span>
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => viewTurmaStudents(row.original)} title="Ver Alunos">
            <User className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => editTurma(row.original)} title="Editar">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteTurma(row.original.id)} title="Excluir">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Gerenciar Turmas</h1>
        <Button onClick={addNewTurma}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Turma
        </Button>
      </div>
      
      {loading && turmas.length === 0 ? (
        <div className="flex justify-center py-8">Carregando turmas...</div>
      ) : (
        <DataTable
          columns={columns}
          data={turmas}
          filterPlaceholder="Buscar por nome da turma..."
        />
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Turma' : 'Adicionar Turma'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Turma *</Label>
              <Input
                id="nome"
                value={currentTurma.nome || ''}
                onChange={(e) => setCurrentTurma({ ...currentTurma, nome: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="numero_sala">Número da Sala *</Label>
              <Input
                id="numero_sala"
                value={currentTurma.numero_sala || ''}
                onChange={(e) => setCurrentTurma({ ...currentTurma, numero_sala: e.target.value })}
              />
            </div>
            
            {isEditing && (
              <div className="space-y-2">
                <Label>Cadastrado por</Label>
                <div className="px-3 py-2 bg-muted rounded flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{currentTurma.usuario_email || 'Não atribuído'}</span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={saveTurma} disabled={loading}>
              {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ClassStudentsModal
        open={studentsModalOpen}
        onOpenChange={setStudentsModalOpen}
        turma={selectedTurmaForStudents}
      />
    </div>
  );
};

export default Classes;
