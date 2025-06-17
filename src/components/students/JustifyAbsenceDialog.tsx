
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface JustifyAbsenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  presenca: {
    id: string;
    data_chamada: string;
    aluno: { nome: string };
  } | null;
  onAbsenceJustified: () => void;
}

const JustifyAbsenceDialog: React.FC<JustifyAbsenceDialogProps> = ({
  open,
  onOpenChange,
  presenca,
  onAbsenceJustified
}) => {
  const [motivo, setMotivo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJustify = async () => {
    if (!presenca || !motivo.trim()) return;

    setLoading(true);
    try {
      // Atualizar a presença para falta justificada
      const { error: presencaError } = await supabase
        .from('presencas')
        .update({ falta_justificada: true })
        .eq('id', presenca.id);

      if (presencaError) throw presencaError;

      // Criar registro de justificativa com presenca_id correto
      const { error: justificativaError } = await supabase
        .from('justificativas_faltas')
        .insert({
          presenca_id: presenca.id,
          motivo: motivo.trim()
        });

      if (justificativaError) throw justificativaError;

      toast({
        title: 'Falta justificada',
        description: 'A falta foi justificada com sucesso.',
      });

      onAbsenceJustified();
      onOpenChange(false);
      setMotivo('');
    } catch (error) {
      console.error('Erro ao justificar falta:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao justificar a falta.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md mx-4 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Justificar Falta</DialogTitle>
        </DialogHeader>
        {presenca && (
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm sm:text-base"><strong>Aluno:</strong> {presenca.aluno.nome}</p>
              <p className="text-sm sm:text-base"><strong>Data:</strong> {new Date(presenca.data_chamada).toLocaleDateString('pt-BR')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="motivo" className="text-sm sm:text-base">Motivo da Justificativa</Label>
              <Textarea
                id="motivo"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Digite o motivo da justificativa..."
                rows={4}
                className="text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleJustify} 
                disabled={loading || !motivo.trim()}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                {loading ? 'Justificando...' : 'Justificar Falta'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JustifyAbsenceDialog;
