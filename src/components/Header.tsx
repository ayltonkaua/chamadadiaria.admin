import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { escolaService, EscolaConfiguracao } from '@/lib/services/escolaService';

export function Header() {
  const { user } = useAuth();
  const [configuracao, setConfiguracao] = useState<EscolaConfiguracao | null>(null);

  useEffect(() => {
    const loadConfiguracao = async () => {
      try {
        const data = await escolaService.getConfiguracao();
        setConfiguracao(data);
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
      }
    };

    loadConfiguracao();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header 
      className="border-b"
      style={{
        backgroundColor: configuracao?.cor_primaria || '#6D28D9',
        color: '#fff'
      }}
    >
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-4">
          {configuracao?.url_logo && (
            <img
              src={configuracao.url_logo}
              alt="Logo da escola"
              className="h-10 w-10 object-contain bg-white rounded-lg p-1"
            />
          )}
          <h2 className="text-lg font-semibold">
            {configuracao?.nome || 'Sistema de Chamadas'}
          </h2>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <span className="text-sm text-white/80">
            {user?.email}
          </span>
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
} 