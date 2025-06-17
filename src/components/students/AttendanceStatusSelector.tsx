
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AttendanceStatusSelectorProps {
  status: 'presente' | 'falta' | 'falta_justificada';
  onStatusChange: (status: 'presente' | 'falta' | 'falta_justificada') => void;
  onMotivoReset: () => void;
}

const AttendanceStatusSelector: React.FC<AttendanceStatusSelectorProps> = ({
  status,
  onStatusChange,
  onMotivoReset
}) => {
  const handleStatusChange = (value: 'presente' | 'falta' | 'falta_justificada') => {
    onStatusChange(value);
    // Limpar motivo se não for falta justificada
    if (value !== 'falta_justificada') {
      onMotivoReset();
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="status" className="text-sm sm:text-base">Status</Label>
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="text-sm sm:text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="presente" className="text-sm sm:text-base">Presente</SelectItem>
          <SelectItem value="falta" className="text-sm sm:text-base">Falta</SelectItem>
          <SelectItem value="falta_justificada" className="text-sm sm:text-base">Falta Justificada</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AttendanceStatusSelector;
