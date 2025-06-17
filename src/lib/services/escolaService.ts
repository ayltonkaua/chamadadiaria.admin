import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface EscolaConfiguracao {
  id: string;
  nome: string;
  email: string;
  url_logo?: string;
  endereco?: string;
  telefone?: string;
  cor_primaria: string;
  cor_secundaria: string;
  criado_em: string;
  atualizado_em: string;
}

export const escolaService = {
  getConfiguracao: async () => {
    try {
      // Primeiro, tenta buscar a configuração existente
      const { data, error } = await supabase
        .from('escola_configuracao')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Se não encontrou nenhum registro, cria um novo
          return await escolaService.createInitialConfig();
        }
        throw error;
      }

      return data as EscolaConfiguracao;
    } catch (error: any) {
      console.error("Erro ao buscar configuração da escola:", error);
      toast({
        title: 'Erro ao carregar configuração',
        description: error.message || 'Ocorreu um erro ao carregar a configuração da escola.',
        variant: 'destructive'
      });
      throw error;
    }
  },

  createInitialConfig: async () => {
    try {
      const { data, error } = await supabase
        .from('escola_configuracao')
        .insert([
          {
            nome: 'Minha Escola',
            email: 'escola@exemplo.com',
            cor_primaria: '#6D28D9',
            cor_secundaria: '#4F46E5'
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Configuração inicial criada',
        description: 'Uma configuração inicial foi criada para sua escola.',
      });

      return data as EscolaConfiguracao;
    } catch (error: any) {
      console.error("Erro ao criar configuração inicial:", error);
      toast({
        title: 'Erro ao criar configuração',
        description: error.message || 'Ocorreu um erro ao criar a configuração inicial da escola.',
        variant: 'destructive'
      });
      throw error;
    }
  },

  updateConfiguracao: async (configuracao: Partial<EscolaConfiguracao>) => {
    try {
      const { data, error } = await supabase
        .from('escola_configuracao')
        .update({
          ...configuracao,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', configuracao.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Configuração atualizada',
        description: 'As configurações da escola foram atualizadas com sucesso.',
      });

      return data as EscolaConfiguracao;
    } catch (error: any) {
      console.error("Erro ao atualizar configuração da escola:", error);
      toast({
        title: 'Erro ao atualizar',
        description: error.message || 'Ocorreu um erro ao atualizar a configuração da escola.',
        variant: 'destructive'
      });
      throw error;
    }
  },

  uploadLogo: async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('escola')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('escola')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error("Erro ao fazer upload do logo:", error);
      toast({
        title: 'Erro ao fazer upload',
        description: error.message || 'Ocorreu um erro ao fazer upload do logo.',
        variant: 'destructive'
      });
      throw error;
    }
  }
}; 