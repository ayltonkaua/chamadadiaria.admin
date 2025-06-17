
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, Plus, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { alunosService, Aluno } from '@/lib/services/alunosService';
import { turmasService, Turma } from '@/lib/services/turmasService';
import StudentForm from '@/components/students/StudentForm';
import StudentProfileModal from '@/components/students/StudentProfileModal';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Aluno[]>([]);
  const [classes, setClasses] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Partial<Aluno>>({});
  const [selectedStudent, setSelectedStudent] = useState<Aluno | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const [studentsData, classesData] = await Promise.all([
          alunosService.getAll(),
          turmasService.getAll()
        ]);
        
        setStudents(studentsData);
        setClasses(classesData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const saveStudent = async (studentData: Partial<Aluno>) => {
    try {
      if (isEditing && currentStudent.id) {
        // Atualizar aluno existente
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
      } else {
        // Criar novo aluno
        if (!studentData.nome || !studentData.matricula || !studentData.turma_id) {
          toast({
            title: 'Dados incompletos',
            description: 'Todos os campos obrigatórios devem ser preenchidos.',
            variant: 'destructive',
          });
          return;
        }
        
        const newStudent = await alunosService.create({
          nome: studentData.nome,
          matricula: studentData.matricula,
          turma_id: studentData.turma_id
        });
        
        setStudents(prev => [...prev, newStudent]);
        
        toast({
          title: 'Aluno adicionado',
          description: 'Novo aluno cadastrado com sucesso.',
        });
      }
      
      // Resetar o estado
      setCurrentStudent({});
      setIsEditing(false);
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  // Excluir aluno
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
  
  // Editar aluno
  const editStudent = (student: Aluno) => {
    setCurrentStudent(student);
    setIsEditing(true);
    setDialogOpen(true);
  };
  
  // Adicionar novo aluno
  const addNewStudent = () => {
    setCurrentStudent({});
    setIsEditing(false);
    setDialogOpen(true);
  };

  // Visualizar perfil do aluno
  const viewStudentProfile = (student: Aluno) => {
    setSelectedStudent(student);
    setProfileModalOpen(true);
  };

  // Definir colunas da tabela
  const columns: ColumnDef<Aluno>[] = [
    {
      accessorKey: 'matricula',
      header: 'Matrícula',
      cell: ({ row }) => (
        <span className="text-xs sm:text-sm">{row.getValue('matricula')}</span>
      ),
    },
    {
      accessorKey: 'nome',
      header: 'Nome',
      cell: ({ row }) => (
        <span className="text-xs sm:text-sm">{row.getValue('nome')}</span>
      ),
    },
    {
      accessorKey: 'turma_id',
      header: 'Turma',
      cell: ({ row }) => {
        const turmaId = row.getValue('turma_id') as string;
        const turma = classes.find(c => c.id === turmaId);
        return <span className="text-xs sm:text-sm">{turma ? turma.nome : turmaId}</span>;
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => (
        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => viewStudentProfile(row.original)} 
            title="Ver perfil"
            className="w-full sm:w-auto text-xs h-8"
          >
            <User className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="ml-1 sm:hidden">Perfil</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => editStudent(row.original)} 
            title="Editar"
            className="w-full sm:w-auto text-xs h-8"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="ml-1 sm:hidden">Editar</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => deleteStudent(row.original.id)} 
            title="Excluir"
            className="w-full sm:w-auto text-xs h-8"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="ml-1 sm:hidden">Excluir</span>
          </Button>
        </div>
      ),
    },
  ];
  
  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Gerenciar Alunos</h1>
        <Button onClick={addNewStudent} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Novo Aluno
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="text-sm sm:text-base">Carregando dados...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={students}
            filterPlaceholder="Buscar por nome ou matrícula..."
            filterColumn="nome"
          />
        </div>
      )}
      
      <StudentForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={saveStudent}
        isEditing={isEditing}
        currentStudent={currentStudent}
        classes={classes}
      />

      <StudentProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        student={selectedStudent}
      />
    </div>
  );
};

export default Students;
