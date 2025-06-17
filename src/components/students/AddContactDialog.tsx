
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentId: string;
  onContactAdded: () => void;
}

const AddContactDialog: React.FC<AddContactDialogProps> = ({
  open,
  onOpenChange,
  studentId,
  onContactAdded
}) => {
  const [formData, setFormData] = useState({
    data_contato: '',
    forma_contato: '',
    justificativa_faltas: '',
    link_arquivo: '',
    monitor_responsavel: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.data_contato || !formData.forma_contato || !formData.justificativa_faltas || !formData.monitor_responsavel) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Preencha todos os campos obrigatórios.',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('registros_contato_busca_ativa')
        .insert({
          aluno_id: studentId,
          data_contato: formData.data_contato,
          forma_contato: formData.forma_contato,
          justificativa_faltas: formData.justificativa_faltas,
          link_arquivo: formData.link_arquivo || null,
          monitor_responsavel: formData.monitor_responsavel
        });

      if (error) throw error;

      toast({
        title: 'Registro adicionado',
        description: 'Registro de contato salvo com sucesso.',
      });

      setFormData({
        data_contato: '',
        forma_contato: '',
        justificativa_faltas: '',
        link_arquivo: '',
        monitor_responsavel: ''
      });

      onContactAdded();
      onOpenChange(false);

    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Registro de Contato</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="data_contato">Data do Contato *</Label>
            <Input
              id="data_contato"
              type="date"
              value={formData.data_contato}
              onChange={(e) => setFormData(prev => ({...prev, data_contato: e.target.value}))}
              required
            />
          </div>

          <div>
            <Label htmlFor="forma_contato">Forma de Contato *</Label>
            <Input
              id="forma_contato"
              placeholder="Ex: Telefone, WhatsApp, Presencial, etc."
              value={formData.forma_contato}
              onChange={(e) => setFormData(prev => ({...prev, forma_contato: e.target.value}))}
              required
            />
          </div>

          <div>
            <Label htmlFor="justificativa_faltas">Justificativa das Faltas *</Label>
            <Textarea
              id="justificativa_faltas"
              placeholder="Descreva a justificativa apresentada para as faltas..."
              value={formData.justificativa_faltas}
              onChange={(e) => setFormData(prev => ({...prev, justificativa_faltas: e.target.value}))}
              required
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="link_arquivo">Link do Arquivo (opcional)</Label>
            <Input
              id="link_arquivo"
              type="url"
              placeholder="https://..."
              value={formData.link_arquivo}
              onChange={(e) => setFormData(prev => ({...prev, link_arquivo: e.target.value}))}
            />
          </div>

          <div>
            <Label htmlFor="monitor_responsavel">Monitor Responsável *</Label>
            <Input
              id="monitor_responsavel"
              placeholder="Nome do monitor que realizou o contato"
              value={formData.monitor_responsavel}
              onChange={(e) => setFormData(prev => ({...prev, monitor_responsavel: e.target.value}))}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContactDialog;
