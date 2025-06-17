
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EditObservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  observacao: {
    id: string;
    titulo: string;
    descricao: string;
  } | null;
  onObservationUpdated: () => void;
}

const EditObservationDialog: React.FC<EditObservationDialogProps> = ({
  open,
  onOpenChange,
  observacao,
  onObservationUpdated
}) => {
  const [titulo, setTitulo] = useState(observacao?.titulo || '');
  const [descricao, setDescricao] = useState(observacao?.descricao || '');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (observacao) {
      setTitulo(observacao.titulo);
      setDescricao(observacao.descricao);
    }
  }, [observacao]);

  const handleSave = async () => {
    if (!observacao || !titulo.trim() || !descricao.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('observacoes_alunos')
        .update({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', observacao.id);

      if (error) throw error;

      toast({
        title: 'Observação atualizada',
        description: 'A observação foi atualizada com sucesso.',
      });

      onObservationUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar observação:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar a observação.',
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
          <DialogTitle>Editar Observação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título da observação"
            />
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição da observação"
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading || !titulo.trim() || !descricao.trim()}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditObservationDialog;
