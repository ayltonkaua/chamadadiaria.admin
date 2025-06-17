
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { alunosService, type Aluno } from '@/lib/services/alunosService';
import { turmasService, type Turma } from '@/lib/services/turmasService';
import { presencasService } from '@/lib/services/presencasService';

interface BatchAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AlunoPresenca {
  id: string;
  presente: boolean;
  falta_justificada: boolean;
  motivo_justificativa: string;
}

export const BatchAttendanceDialog: React.FC<BatchAttendanceDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [loading, setLoading] = useState(false);
  const [chamadaEmLote, setChamadaEmLote] = useState({
    turma_id: '',
    data_chamada: new Date().toISOString().split('T')[0],
    alunos: [] as AlunoPresenca[]
  });

  const queryClient = useQueryClient();

  const { data: turmas = [] } = useQuery({
    queryKey: ['turmas'],
    queryFn: turmasService.getAll,
  });

  const { data: alunos = [] } = useQuery({
    queryKey: ['alunos'],
    queryFn: alunosService.getAll,
  });

  const handleTurmaChange = (value: string) => {
    setChamadaEmLote(prev => ({
      ...prev,
      turma_id: value,
      alunos: []
    }));
  };

  const handleDataChange = (value: string) => {
    setChamadaEmLote(prev => ({
      ...prev,
      data_chamada: value
    }));
  };

  const handleLoadStudents = () => {
    const alunosDaTurma = alunos.filter(a => a.turma_id === chamadaEmLote.turma_id);
    setChamadaEmLote(prev => ({
      ...prev,
      alunos: alunosDaTurma.map(a => ({ 
        id: a.id, 
        presente: true,
        falta_justificada: false,
        motivo_justificativa: ''
      }))
    }));
  };

  const handleStatusChange = (alunoId: string, presente: boolean) => {
    setChamadaEmLote(prev => ({
      ...prev,
      alunos: prev.alunos.map(a => 
        a.id === alunoId ? { 
          ...a, 
          presente,
          falta_justificada: presente ? false : a.falta_justificada
        } : a
      )
    }));
  };

  const handleJustificativaChange = (alunoId: string, falta_justificada: boolean) => {
    setChamadaEmLote(prev => ({
      ...prev,
      alunos: prev.alunos.map(a => 
        a.id === alunoId ? { 
          ...a, 
          falta_justificada,
          motivo_justificativa: falta_justificada ? a.motivo_justificativa : ''
        } : a
      )
    }));
  };

  const handleMotivoChange = (alunoId: string, motivo: string) => {
    setChamadaEmLote(prev => ({
      ...prev,
      alunos: prev.alunos.map(a => 
        a.id === alunoId ? { ...a, motivo_justificativa: motivo } : a
      )
    }));
  };

  const handleMarkAllPresent = () => {
    setChamadaEmLote(prev => ({
      ...prev,
      alunos: prev.alunos.map(a => ({ 
        ...a, 
        presente: true,
        falta_justificada: false,
        motivo_justificativa: ''
      }))
    }));
  };

  const handleMarkAllAbsent = () => {
    setChamadaEmLote(prev => ({
      ...prev,
      alunos: prev.alunos.map(a => ({ 
        ...a, 
        presente: false,
        falta_justificada: false,
        motivo_justificativa: ''
      }))
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      for (const aluno of chamadaEmLote.alunos) {
        await presencasService.create({
          aluno_id: aluno.id,
          turma_id: chamadaEmLote.turma_id,
          data_chamada: chamadaEmLote.data_chamada,
          presente: aluno.presente,
          falta_justificada: aluno.falta_justificada,
          motivo_justificativa: aluno.motivo_justificativa
        });
      }

      toast({
        title: 'Sucesso',
        description: 'Chamada registrada com sucesso!',
      });

      queryClient.invalidateQueries({ queryKey: ['presencas'] });
      setChamadaEmLote({
        turma_id: '',
        data_chamada: new Date().toISOString().split('T')[0],
        alunos: []
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar a chamada.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Realizar Chamada</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="turma_chamada">Turma *</Label>
              <Select 
                value={chamadaEmLote.turma_id} 
                onValueChange={handleTurmaChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a turma" />
                </SelectTrigger>
                <SelectContent>
                  {turmas.map((turma) => (
                    <SelectItem key={turma.id} value={turma.id}>
                      {turma.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="data_chamada">Data da Chamada *</Label>
              <Input
                id="data_chamada"
                type="date"
                value={chamadaEmLote.data_chamada}
                onChange={(e) => handleDataChange(e.target.value)}
              />
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleLoadStudents}
              disabled={!chamadaEmLote.turma_id}
            >
              Carregar Alunos da Turma
            </Button>
          </div>
          
          {chamadaEmLote.alunos.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Lista de Alunos</h3>
              
              <div className="max-h-80 overflow-y-auto border rounded p-4">
                {alunos
                  .filter(a => chamadaEmLote.alunos.some(ca => ca.id === a.id))
                  .map(aluno => {
                    const alunoEmLote = chamadaEmLote.alunos.find(a => a.id === aluno.id);
                    
                    return (
                      <div 
                        key={aluno.id} 
                        className="border-b p-4 last:border-0 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{aluno.nome}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant={alunoEmLote?.presente ? "default" : "destructive"}>
                              {alunoEmLote?.presente ? 'Presente' : 'Ausente'}
                            </Badge>
                            <Switch
                              id={`presente-${aluno.id}`}
                              checked={alunoEmLote?.presente || false}
                              onCheckedChange={(checked) => handleStatusChange(aluno.id, checked)}
                            />
                          </div>
                        </div>
                        
                        {!alunoEmLote?.presente && (
                          <div className="space-y-2 pl-4 border-l-2 border-orange-200">
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`justificada-${aluno.id}`}
                                checked={alunoEmLote?.falta_justificada || false}
                                onCheckedChange={(checked) => handleJustificativaChange(aluno.id, checked)}
                              />
                              <Label htmlFor={`justificada-${aluno.id}`} className="text-sm">
                                Falta Justificada
                              </Label>
                            </div>
                            
                            {alunoEmLote?.falta_justificada && (
                              <div className="space-y-1">
                                <Label htmlFor={`motivo-${aluno.id}`} className="text-sm text-muted-foreground">
                                  Motivo da justificativa:
                                </Label>
                                <Textarea
                                  id={`motivo-${aluno.id}`}
                                  placeholder="Descreva o motivo da falta justificada..."
                                  value={alunoEmLote?.motivo_justificativa || ''}
                                  onChange={(e) => handleMotivoChange(aluno.id, e.target.value)}
                                  className="min-h-[60px]"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleMarkAllPresent}
                >
                  Marcar Todos Presentes
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleMarkAllAbsent}
                >
                  Marcar Todos Ausentes
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={chamadaEmLote.alunos.length === 0 || loading}
          >
            {loading ? 'Salvando...' : 'Salvar Chamada'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
