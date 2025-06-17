
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAttendanceEdit } from '@/hooks/useAttendanceEdit';
import AttendanceStatusSelector from './AttendanceStatusSelector';
import JustificationInput from './JustificationInput';

interface EditAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presenca: {
    id: string;
    data_chamada: string;
    presente: boolean;
    falta_justificada: boolean;
    aluno: { nome: string };
    justificativa?: { id: string; motivo: string } | null;
  } | null;
  onAttendanceUpdated: () => void;
}

const EditAttendanceDialog: React.FC<EditAttendanceDialogProps> = ({
  open,
  onOpenChange,
  presenca,
  onAttendanceUpdated
}) => {
  const {
    status,
    setStatus,
    motivo,
    setMotivo,
    loading,
    resetForm,
    saveAttendance
  } = useAttendanceEdit(presenca);

  const handleSave = async () => {
    await saveAttendance(() => {
      onAttendanceUpdated();
      onOpenChange(false);
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Editar Status de Presença</DialogTitle>
        </DialogHeader>
        {presenca && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm sm:text-base"><strong>Aluno:</strong> {presenca.aluno.nome}</p>
              <p className="text-sm sm:text-base"><strong>Data:</strong> {format(new Date(presenca.data_chamada), 'dd/MM/yyyy', { locale: ptBR })}</p>
            </div>
            
            <AttendanceStatusSelector
              status={status}
              onStatusChange={setStatus}
              onMotivoReset={() => setMotivo('')}
            />

            <JustificationInput
              motivo={motivo}
              onMotivoChange={setMotivo}
              show={status === 'falta_justificada'}
            />

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={loading || (status === 'falta_justificada' && !motivo.trim())}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditAttendanceDialog;
