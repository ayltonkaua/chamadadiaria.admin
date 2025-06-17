
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export type Usuario = {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: string;
};

// Helper function to get the default escola_id (first escola in the system)
const getDefaultEscolaId = async (): Promise<string> => {
  const { data: escola } = await supabase
    .from('escola_configuracao')
    .select('id')
    .limit(1)
    .single();
    
  if (!escola?.id) {
    // If no escola exists, create a default one
    const { data: newEscola } = await supabase
      .from('escola_configuracao')
      .insert({
        nome: 'Escola Padrão',
        email: 'admin@escola.com'
      })
      .select('id')
      .single();
      
    return newEscola?.id || '';
  }
  
  return escola.id;
};

export const usuariosService = {
  getAll: async () => {
    try {
      // Obter usuários do Supabase Auth
      const { data: { users: authUsers }, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        throw authError;
      }
      
      // Para cada usuário, obtenha seu papel/função
      if (authUsers) {
        const usersWithRoles = await Promise.all(
          authUsers.map(async (user) => {
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', user.id)
              .maybeSingle();
              
            return {
              id: user.id,
              email: user.email || '',
              created_at: user.created_at || '',
              updated_at: user.last_sign_in_at || user.created_at || '',
              role: roleData?.role || 'user',
            };
          })
        );
        
        return usersWithRoles;
      }
      
      return [];
    } catch (error: any) {
      console.error("Erro ao buscar usuários:", error);
      toast({ 
        title: 'Erro ao carregar usuários', 
        description: error.message || 'Ocorreu um erro ao carregar a lista de usuários.',
        variant: 'destructive'
      });
      return [];
    }
  },
  
  create: async (email: string, password: string, role: string = 'user') => {
    try {
      // Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Obter escola_id padrão
        const escolaId = await getDefaultEscolaId();
        
        // Adicionar papel/função do usuário
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: role,
            escola_id: escolaId
          });
          
        if (roleError) throw roleError;
        
        return {
          id: authData.user.id,
          email: authData.user.email || '',
          created_at: authData.user.created_at,
          updated_at: authData.user.created_at,
          role: role,
        };
      }
      
      throw new Error('Falha ao criar usuário');
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  updatePassword: async (id: string, password: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        id,
        { password }
      );
      
      if (error) throw error;
      return true;
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  updateRole: async (id: string, role: string) => {
    try {
      // Obter escola_id padrão
      const escolaId = await getDefaultEscolaId();
      
      const { error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: id,
          role,
          escola_id: escolaId
        });
        
      if (error) throw error;
      return true;
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(id);
        
      if (error) throw error;
      
      // A função deleteUser deveria excluir automaticamente 
      // os registros nas tabelas com foreign keys configuradas,
      // mas para garantir, podemos excluir explicitamente
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id);
        
      return true;
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
      throw error;
    }
  }
};
