
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { alunosService, Aluno } from '@/lib/services/alunosService';
import { Turma } from '@/lib/services/turmasService';
import { ArrowRightLeft } from 'lucide-react';

interface TransferStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Aluno | null;
  classes: Turma[];
  onTransferComplete: () => void;
}

const TransferStudentDialog: React.FC<TransferStudentDialogProps> = ({
  open,
  onOpenChange,
  student,
  classes,
  onTransferComplete
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!student || !selectedClassId) {
      toast({
        title: 'Seleção obrigatória',
        description: 'Selecione uma turma para transferir o aluno.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await alunosService.update(student.id, {
        turma_id: selectedClassId
      });

      const selectedClass = classes.find(c => c.id === selectedClassId);
      
      toast({
        title: 'Aluno transferido',
        description: `${student.nome} foi transferido para a turma ${selectedClass?.nome}.`,
      });

      onTransferComplete();
      setSelectedClassId('');
    } catch (error: any) {
      toast({
        title: 'Erro ao transferir',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ArrowRightLeft className="h-5 w-5" />
            <span>Transferir Aluno</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Aluno</Label>
            <div className="px-3 py-2 bg-muted rounded">
              <strong>{student?.nome}</strong> - {student?.matricula}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nova-turma">Nova Turma *</Label>
            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a nova turma" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((turma) => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome} - Sala {turma.numero_sala}
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
          <Button onClick={handleTransfer} disabled={loading || !selectedClassId}>
            {loading ? 'Transferindo...' : 'Transferir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferStudentDialog;
