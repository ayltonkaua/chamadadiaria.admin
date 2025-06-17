
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const AlertsHeader: React.FC = () => {
  return (
    <div className="flex items-center space-x-2">
      <AlertTriangle className="h-6 w-6 text-red-500" />
      <h1 className="text-2xl font-bold tracking-tight">Alertas de Faltas</h1>
    </div>
  );
};

export default AlertsHeader;
