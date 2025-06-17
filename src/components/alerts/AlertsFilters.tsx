
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface AlertsFiltersProps {
  limiarFaltas: number;
  onLimiarChange: (novoLimiar: number) => void;
  onExport: () => void;
  loading: boolean;
  totalAlunos: number;
}

const AlertsFilters: React.FC<AlertsFiltersProps> = ({
  limiarFaltas,
  onLimiarChange,
  onExport,
  loading,
  totalAlunos
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="space-x-2">
        <Button 
          variant={limiarFaltas === 1 ? "default" : "outline"}
          onClick={() => onLimiarChange(1)}
        >
          1+ Faltas
        </Button>
        <Button 
          variant={limiarFaltas === 3 ? "default" : "outline"}
          onClick={() => onLimiarChange(3)}
        >
          3+ Faltas
        </Button>
        <Button 
          variant={limiarFaltas === 5 ? "default" : "outline"}
          onClick={() => onLimiarChange(5)}
        >
          5+ Faltas
        </Button>
        <Button 
          variant={limiarFaltas === 8 ? "default" : "outline"}
          onClick={() => onLimiarChange(8)}
        >
          8+ Faltas
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          onClick={onExport}
          disabled={loading || totalAlunos === 0}
          className="flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Exportar Excel</span>
        </Button>
        
        <p className="text-sm text-muted-foreground">
          {`Mostrando alunos com ${limiarFaltas} ou mais faltas`}
        </p>
      </div>
    </div>
  );
};

export default AlertsFilters;
