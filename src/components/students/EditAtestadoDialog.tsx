
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface EditAtestadoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  atestado: {
    id: string;
    data_inicio: string;
    data_fim: string;
    descricao: string;
    status: string;
  } | null;
  onAtestadoUpdated: () => void;
}

const EditAtestadoDialog: React.FC<EditAtestadoDialogProps> = ({
  open,
  onOpenChange,
  atestado,
  onAtestadoUpdated
}) => {
  const [dataInicio, setDataInicio] = useState(atestado?.data_inicio || '');
  const [dataFim, setDataFim] = useState(atestado?.data_fim || '');
  const [descricao, setDescricao] = useState(atestado?.descricao || '');
  const [status, setStatus] = useState(atestado?.status || 'pendente');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (atestado) {
      setDataInicio(atestado.data_inicio);
      setDataFim(atestado.data_fim);
      setDescricao(atestado.descricao);
      setStatus(atestado.status);
    }
  }, [atestado]);

  const handleSave = async () => {
    if (!atestado || !dataInicio || !dataFim || !descricao.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('atestados')
        .update({
          data_inicio: dataInicio,
          data_fim: dataFim,
          descricao: descricao.trim(),
          status
        })
        .eq('id', atestado.id);

      if (error) throw error;

      toast({
        title: 'Atestado atualizado',
        description: 'O atestado foi atualizado com sucesso.',
      });

      onAtestadoUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar atestado:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o atestado.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Atestado</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataInicio">Data de Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dataFim">Data de Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do atestado"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading || !dataInicio || !dataFim || !descricao.trim()}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditAtestadoDialog;
