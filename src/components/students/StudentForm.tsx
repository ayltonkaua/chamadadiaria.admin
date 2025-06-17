
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Turma } from '@/lib/services/turmasService';
import { Aluno } from '@/lib/services/alunosService';
import { toast } from '@/hooks/use-toast';

interface StudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (student: Partial<Aluno>) => Promise<void>;
  isEditing: boolean;
  currentStudent: Partial<Aluno>;
  classes: Turma[];
}

const StudentForm: React.FC<StudentFormProps> = ({
  open,
  onOpenChange,
  onSave,
  isEditing,
  currentStudent,
  classes
}) => {
  const [student, setStudent] = useState<Partial<Aluno>>(currentStudent);
  const [loading, setLoading] = useState(false);

  // Atualizar formulário quando o estudante atual mudar
  useEffect(() => {
    setStudent(currentStudent);
  }, [currentStudent]);

  const handleSave = async () => {
    try {
      if (!student.nome || !student.matricula || !student.turma_id) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Preencha todos os campos obrigatórios.',
          variant: 'destructive',
        });
        return;
      }

      setLoading(true);
      await onSave(student);
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Aluno' : 'Adicionar Aluno'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={student.nome || ''}
              onChange={(e) => setStudent({ ...student, nome: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="matricula">Matrícula *</Label>
            <Input
              id="matricula"
              value={student.matricula || ''}
              onChange={(e) => setStudent({ ...student, matricula: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="turma_id">Turma *</Label>
            <Select 
              value={student.turma_id} 
              onValueChange={(value) => setStudent({ ...student, turma_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a turma" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((turma) => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentForm;
