import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, ArrowRightLeft, User, SortAsc, SortDesc } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { alunosService, Aluno } from '@/lib/services/alunosService';
import { turmasService, Turma } from '@/lib/services/turmasService';
import StudentForm from '@/components/students/StudentForm';
import TransferStudentDialog from './TransferStudentDialog';

interface ClassStudentsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turma: Turma | null;
}

const ClassStudentsModal: React.FC<ClassStudentsModalProps> = ({
  open,
  onOpenChange,
  turma
}) => {
  const [students, setStudents] = useState<Aluno[]>([]);
  const [allClasses, setAllClasses] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Aluno>>({});
  const [selectedStudent, setSelectedStudent] = useState<Aluno | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Carregar alunos da turma
  useEffect(() => {
    if (turma && open) {
      loadStudents();
      loadAllClasses();
    }
  }, [turma, open]);

  const loadStudents = async () => {
    if (!turma) return;
    
    setLoading(true);
    try {
      const allStudents = await alunosService.getAll();
      const turmaStudents = allStudents.filter(student => student.turma_id === turma.id);
      setStudents(turmaStudents);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllClasses = async () => {
    try {
      const classes = await turmasService.getAll();
      setAllClasses(classes);
    } catch (error) {
      console.error("Erro ao carregar turmas:", error);
    }
  };

  const saveStudent = async (studentData: Partial<Aluno>) => {
    try {
      if (isEditing && currentStudent.id) {
        const updatedStudent = await alunosService.update(
          currentStudent.id, 
          {
            nome: studentData.nome,
            matricula: studentData.matricula,
            turma_id: studentData.turma_id
          }
        );
        
        setStudents(prev => 
          prev.map(student => 
            student.id === updatedStudent.id ? updatedStudent : student
          )
        );
        
        toast({
          title: 'Aluno atualizado',
          description: 'Dados do aluno atualizados com sucesso.',
        });
      }
      
      setCurrentStudent({});
      setIsEditing(false);
      setEditDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      if (confirm('Tem certeza que deseja excluir este aluno?')) {
        await alunosService.delete(id);
        setStudents(prev => prev.filter(student => student.id !== id));
        
        toast({
          title: 'Aluno excluído',
          description: 'Aluno removido com sucesso.',
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

  const editStudent = (student: Aluno) => {
    setCurrentStudent(student);
    setIsEditing(true);
    setEditDialogOpen(true);
  };

  const transferStudent = (student: Aluno) => {
    setSelectedStudent(student);
    setTransferDialogOpen(true);
  };

  const handleTransferComplete = () => {
    loadStudents();
    setTransferDialogOpen(false);
    setSelectedStudent(null);
  };

  const sortStudentsAlphabetically = () => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    
    const sortedStudents = [...students].sort((a, b) => {
      if (newSortOrder === 'asc') {
        return a.nome.localeCompare(b.nome, 'pt-BR');
      } else {
        return b.nome.localeCompare(a.nome, 'pt-BR');
      }
    });
    
    setStudents(sortedStudents);
  };

  const columns: ColumnDef<Aluno>[] = [
    {
      accessorKey: 'matricula',
      header: 'Matrícula',
    },
    {
      accessorKey: 'nome',
      header: 'Nome',
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" onClick={() => editStudent(row.original)} title="Editar">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => transferStudent(row.original)} title="Transferir">
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteStudent(row.original.id)} title="Excluir">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Alunos da Turma: {turma?.nome}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={sortStudentsAlphabetically}
                className="flex items-center space-x-2"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-4 w-4" />
                ) : (
                  <SortDesc className="h-4 w-4" />
                )}
                <span>Ordem Alfabética</span>
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">Carregando alunos...</div>
            ) : (
              <DataTable
                columns={columns}
                data={students}
                filterPlaceholder="Buscar por nome ou matrícula..."
                filterColumn="nome"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <StudentForm
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={saveStudent}
        isEditing={isEditing}
        currentStudent={currentStudent}
        classes={allClasses}
      />

      <TransferStudentDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        student={selectedStudent}
        classes={allClasses.filter(c => c.id !== turma?.id)}
        onTransferComplete={handleTransferComplete}
      />
    </>
  );
};

export default ClassStudentsModal;
