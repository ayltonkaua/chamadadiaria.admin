import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const { user } = useAuth();
  const [configuracao, setConfiguracao] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfiguracao() {
      try {
        const { data, error } = await supabase
          .from('escola_configuracao')
          .select('*')
          .single();

        if (error) throw error;
        setConfiguracao(data);
      } catch (error) {
        console.error('Erro ao carregar configuração:', error);
      } finally {
        setLoading(false);
      }
    }

    loadConfiguracao();
  }, []);

  if (loading) {
    return (
      <header className="border-b">
        <div className="flex h-14 items-center px-4">
          <div className="animate-pulse h-8 w-48 bg-muted rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b" style={{ backgroundColor: configuracao?.cor_primaria || '#1a1a1a' }}>
      <div className="flex h-14 items-center px-4">
        {configuracao?.logo_url && (
          <img
            src={configuracao.logo_url}
            alt="Logo"
            className="h-8 w-8 mr-2"
          />
        )}
        <h1 className="text-lg font-semibold" style={{ color: configuracao?.cor_texto || '#ffffff' }}>
          {configuracao?.nome_escola || 'Admin Chamada'}
        </h1>
      </div>
    </header>
  );
} 