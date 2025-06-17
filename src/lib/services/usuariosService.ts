import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Usuario {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  role: string;
}

// Helper function to get the default escola_id
const getDefaultEscolaId = async (): Promise<string> => {
  const { data: escolas, error } = await supabase
    .from('escola_configuracao')
    .select('id')
    .limit(1);

  if (error || !escolas || escolas.length === 0) {
    throw new Error('Nenhuma escola encontrada no sistema');
  }

  return escolas[0].id;
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
  
  create: async (userData: { email: string, password: string, role: string }) => {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true
      });

      if (authError) throw authError;

      if (authData.user) {
        // Obter escola_id padrão
        const escolaId = await getDefaultEscolaId();

        // Adicionar papel do usuário
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: userData.role,
            escola_id: escolaId
          });

        if (roleError) throw roleError;

        return {
          id: authData.user.id,
          email: authData.user.email || '',
          created_at: authData.user.created_at || '',
          updated_at: authData.user.last_sign_in_at || authData.user.created_at || '',
          role: userData.role
        };
      }

      throw new Error('Erro ao criar usuário');
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      toast({
        title: 'Erro ao criar usuário',
        description: error.message || 'Ocorreu um erro ao criar o usuário.',
        variant: 'destructive'
      });
      throw error;
    }
  },
  
  update: async (id: string, userData: { email?: string, password?: string, role?: string }) => {
    try {
      // Atualizar senha se fornecida
      if (userData.password) {
        const { error: passwordError } = await supabase.auth.admin.updateUserById(
          id,
          { password: userData.password }
        );
        if (passwordError) throw passwordError;
      }

      // Atualizar papel se fornecido
      if (userData.role) {
        const escolaId = await getDefaultEscolaId();
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ 
            role: userData.role,
            escola_id: escolaId
          })
          .eq('user_id', id);

        if (roleError) throw roleError;
      }

      // Buscar usuário atualizado
      const { data: { users }, error: fetchError } = await supabase.auth.admin.listUsers();
      if (fetchError) throw fetchError;

      const updatedUser = users?.find(u => u.id === id);
      if (!updatedUser) throw new Error('Usuário não encontrado');

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', id)
        .maybeSingle();

      return {
        id: updatedUser.id,
        email: updatedUser.email || '',
        created_at: updatedUser.created_at || '',
        updated_at: updatedUser.last_sign_in_at || updatedUser.created_at || '',
        role: roleData?.role || 'user'
      };
    } catch (error: any) {
      console.error("Erro ao atualizar usuário:", error);
      toast({
        title: 'Erro ao atualizar usuário',
        description: error.message || 'Ocorreu um erro ao atualizar o usuário.',
        variant: 'destructive'
      });
      throw error;
    }
  },
  
  delete: async (id: string) => {
    try {
      // Remover papel do usuário
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id);

      if (roleError) throw roleError;

      // Remover usuário do Supabase Auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id);
      if (authError) throw authError;

      return true;
    } catch (error: any) {
      console.error("Erro ao excluir usuário:", error);
      toast({
        title: 'Erro ao excluir usuário',
        description: error.message || 'Ocorreu um erro ao excluir o usuário.',
        variant: 'destructive'
      });
      throw error;
    }
  }
};
