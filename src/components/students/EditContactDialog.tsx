
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface EditContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contato: {
    id: string;
    data_contato: string;
    forma_contato: string;
    justificativa_faltas: string;
    link_arquivo: string | null;
    monitor_responsavel: string;
  } | null;
  onContactUpdated: () => void;
}

const EditContactDialog: React.FC<EditContactDialogProps> = ({
  open,
  onOpenChange,
  contato,
  onContactUpdated
}) => {
  const [dataContato, setDataContato] = useState(contato?.data_contato || '');
  const [formaContato, setFormaContato] = useState(contato?.forma_contato || '');
  const [justificativa, setJustificativa] = useState(contato?.justificativa_faltas || '');
  const [linkArquivo, setLinkArquivo] = useState(contato?.link_arquivo || '');
  const [monitorResponsavel, setMonitorResponsavel] = useState(contato?.monitor_responsavel || '');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (contato) {
      setDataContato(contato.data_contato);
      setFormaContato(contato.forma_contato);
      setJustificativa(contato.justificativa_faltas);
      setLinkArquivo(contato.link_arquivo || '');
      setMonitorResponsavel(contato.monitor_responsavel);
    }
  }, [contato]);

  const handleSave = async () => {
    if (!contato || !dataContato || !formaContato || !justificativa.trim() || !monitorResponsavel.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('registros_contato_busca_ativa')
        .update({
          data_contato: dataContato,
          forma_contato: formaContato,
          justificativa_faltas: justificativa.trim(),
          link_arquivo: linkArquivo.trim() || null,
          monitor_responsavel: monitorResponsavel.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', contato.id);

      if (error) throw error;

      toast({
        title: 'Contato atualizado',
        description: 'O registro de contato foi atualizado com sucesso.',
      });

      onContactUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o registro de contato.',
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
          <DialogTitle>Editar Registro de Contato</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataContato">Data do Contato</Label>
              <Input
                id="dataContato"
                type="date"
                value={dataContato}
                onChange={(e) => setDataContato(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="formaContato">Forma de Contato</Label>
              <Select value={formaContato} onValueChange={setFormaContato}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="telefone">Telefone</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="visita">Visita Domiciliar</SelectItem>
                  <SelectItem value="presencial">Presencial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="monitorResponsavel">Monitor Responsável</Label>
            <Input
              id="monitorResponsavel"
              value={monitorResponsavel}
              onChange={(e) => setMonitorResponsavel(e.target.value)}
              placeholder="Nome do monitor responsável"
            />
          </div>
          <div>
            <Label htmlFor="justificativa">Justificativa das Faltas</Label>
            <Textarea
              id="justificativa"
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              placeholder="Justificativa apresentada para as faltas"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="linkArquivo">Link do Arquivo (opcional)</Label>
            <Input
              id="linkArquivo"
              value={linkArquivo}
              onChange={(e) => setLinkArquivo(e.target.value)}
              placeholder="URL do arquivo de evidência"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading || !dataContato || !formaContato || !justificativa.trim() || !monitorResponsavel.trim()}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditContactDialog;
