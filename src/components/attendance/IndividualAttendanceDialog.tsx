
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
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

interface IndividualAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const IndividualAttendanceDialog: React.FC<IndividualAttendanceDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [turmaSelecionada, setTurmaSelecionada] = useState('');
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(new Date().toISOString().split('T')[0]);
  const [presente, setPresente] = useState(true);
  const [faltaJustificada, setFaltaJustificada] = useState(false);
  const [motivoJustificativa, setMotivoJustificativa] = useState('');

  const queryClient = useQueryClient();

  const { data: turmas = [] } = useQuery({
    queryKey: ['turmas'],
    queryFn: turmasService.getAll,
  });

  const { data: alunos = [] } = useQuery({
    queryKey: ['alunos'],
    queryFn: alunosService.getAll,
  });

  const alunosFiltrados = alunos.filter(aluno => aluno.turma_id === turmaSelecionada);

  const handleTurmaChange = (value: string) => {
    setTurmaSelecionada(value);
    setAlunoSelecionado('');
  };

  const handlePresenteChange = (value: boolean) => {
    setPresente(value);
    if (value) {
      setFaltaJustificada(false);
      setMotivoJustificativa('');
    }
  };

  const handleSave = async () => {
    // Validar se falta justificada tem motivo
    if (!presente && faltaJustificada && !motivoJustificativa.trim()) {
      toast({
        title: 'Erro',
        description: 'Para falta justificada é necessário informar o motivo.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await presencasService.create({
        aluno_id: alunoSelecionado,
        turma_id: turmaSelecionada,
        data_chamada: dataSelecionada,
        presente,
        falta_justificada: !presente ? faltaJustificada : false,
        motivo_justificativa: (!presente && faltaJustificada) ? motivoJustificativa : undefined
      });

      toast({
        title: 'Sucesso',
        description: 'Presença registrada com sucesso!',
      });

      queryClient.invalidateQueries({ queryKey: ['presencas'] });
      
      // Reset form
      setTurmaSelecionada('');
      setAlunoSelecionado('');
      setDataSelecionada(new Date().toISOString().split('T')[0]);
      setPresente(true);
      setFaltaJustificada(false);
      setMotivoJustificativa('');
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar a presença.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Presença</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="turma">Turma *</Label>
            <Select 
              value={turmaSelecionada} 
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
            <Label htmlFor="aluno">Aluno *</Label>
            <Select 
              value={alunoSelecionado} 
              onValueChange={setAlunoSelecionado}
              disabled={!turmaSelecionada}
            >
              <SelectTrigger>
                <SelectValue placeholder={
                  turmaSelecionada 
                    ? "Selecione o aluno" 
                    : "Primeiro selecione uma turma"
                } />
              </SelectTrigger>
              <SelectContent>
                {alunosFiltrados.map((aluno) => (
                  <SelectItem key={aluno.id} value={aluno.id}>
                    {aluno.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="data">Data da Chamada *</Label>
            <Input
              id="data"
              type="date"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="presente">Status</Label>
              <Switch
                id="presente"
                checked={presente}
                onCheckedChange={handlePresenteChange}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {presente ? 'Aluno presente na aula' : 'Aluno ausente da aula'}
            </p>
          </div>

          {!presente && (
            <div className="space-y-3 p-3 border rounded-lg bg-orange-50">
              <div className="flex items-center space-x-2">
                <Switch
                  id="falta-justificada"
                  checked={faltaJustificada}
                  onCheckedChange={setFaltaJustificada}
                />
                <Label htmlFor="falta-justificada">Falta Justificada</Label>
              </div>
              
              {faltaJustificada && (
                <div className="space-y-2">
                  <Label htmlFor="motivo">Motivo da justificativa *</Label>
                  <Textarea
                    id="motivo"
                    placeholder="Descreva o motivo da falta justificada..."
                    value={motivoJustificativa}
                    onChange={(e) => setMotivoJustificativa(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!turmaSelecionada || !alunoSelecionado}
          >
            Registrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
