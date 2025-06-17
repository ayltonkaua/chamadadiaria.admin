
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface JustificationInputProps {
  motivo: string;
  onMotivoChange: (motivo: string) => void;
  show: boolean;
}

const JustificationInput: React.FC<JustificationInputProps> = ({
  motivo,
  onMotivoChange,
  show
}) => {
  if (!show) return null;

  return (
    <div className="space-y-2">
      <Label htmlFor="motivo" className="text-sm sm:text-base">Motivo da Justificativa</Label>
      <Textarea
        id="motivo"
        value={motivo}
        onChange={(e) => onMotivoChange(e.target.value)}
        placeholder="Digite o motivo da justificativa..."
        rows={3}
        className="text-sm sm:text-base"
      />
    </div>
  );
};

export default JustificationInput;
