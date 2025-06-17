
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { WifiOff, Wifi, RefreshCw, Database } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const { isOnline, hasOfflineData, syncOfflineData, offlineCount } = useOfflineSync();

  if (isOnline && !hasOfflineData) {
    return null; // Não mostrar nada quando online e sem dados offline
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4 text-green-600" />
              Conectado
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-red-600" />
              Modo Offline
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-muted-foreground">
              Dados offline:
            </span>
            <Badge variant={offlineCount > 0 ? "destructive" : "secondary"}>
              {offlineCount} registros
            </Badge>
          </div>
          
          {isOnline && hasOfflineData && (
            <Button
              size="sm"
              onClick={syncOfflineData}
              className="gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Sincronizar
            </Button>
          )}
        </div>
        
        {!isOnline && (
          <p className="text-xs text-muted-foreground mt-2">
            Você está offline. As chamadas serão salvas localmente e sincronizadas quando a internet retornar.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
