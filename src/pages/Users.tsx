
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, Plus, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { usuariosService, Usuario } from '@/lib/services/usuariosService';
import UserForm from '@/components/users/UserForm';

const Users: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<Usuario & { password?: string }>>({});
  const { user: currentAuthUser } = useAuth();

  // Carregar usuários
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      
      try {
        const usersData = await usuariosService.getAll();
        setUsers(usersData);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Salvar usuário
  const saveUser = async (userData: { id?: string, email: string, password?: string, role: string }) => {
    try {
      if (isEditing && userData.id) {
        // Atualizar usuário existente
        if (userData.password) {
          await usuariosService.updatePassword(userData.id, userData.password);
        }
        
        await usuariosService.updateRole(userData.id, userData.role);
        
        // Atualizar lista de usuários
        setUsers(prev => 
          prev.map(user => 
            user.id === userData.id ? 
              { ...user, role: userData.role } : 
              user
          )
        );
        
        toast({
          title: 'Usuário atualizado',
          description: 'O usuário foi atualizado com sucesso.',
        });
      } else {
        // Criar novo usuário
        if (!userData.password) {
          toast({
            title: 'Senha obrigatória',
            description: 'Por favor, forneça uma senha para o novo usuário.',
            variant: 'destructive',
          });
          return;
        }
        
        const newUser = await usuariosService.create(userData.email, userData.password, userData.role);
        setUsers(prev => [...prev, newUser]);
        
        toast({
          title: 'Usuário criado',
          description: 'Novo usuário adicionado com sucesso.',
        });
      }
      
      // Fechar diálogo e resetar estado
      setDialogOpen(false);
      setCurrentUser({});
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  // Excluir usuário
  const deleteUser = async (id: string) => {
    try {
      if (id === currentAuthUser?.id) {
        toast({
          title: 'Operação não permitida',
          description: 'Você não pode excluir sua própria conta.',
          variant: 'destructive',
        });
        return;
      }
      
      if (confirm('Tem certeza que deseja excluir este usuário?')) {
        await usuariosService.delete(id);
        setUsers(prev => prev.filter(user => user.id !== id));
        
        toast({
          title: 'Usuário excluído',
          description: 'O usuário foi removido com sucesso.',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  // Editar usuário
  const editUser = (user: Usuario) => {
    setCurrentUser({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    setIsEditing(true);
    setDialogOpen(true);
  };
  
  // Adicionar novo usuário
  const addNewUser = () => {
    setCurrentUser({ role: 'user' });
    setIsEditing(false);
    setDialogOpen(true);
  };
  
  // Definir colunas da tabela
  const columns: ColumnDef<Usuario>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Função',
      cell: ({ row }) => {
        const role = row.getValue('role') as string;
        return (
          <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
            {role === 'admin' ? 'Administrador' : 'Usuário'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: 'Criado em',
      cell: ({ row }) => {
        const date = row.getValue('created_at') as string;
        return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : 'N/A';
      },
    },
    {
      accessorKey: 'updated_at',
      header: 'Último login',
      cell: ({ row }) => {
        const date = row.getValue('updated_at') as string;
        return date ? format(new Date(date), 'dd/MM/yyyy HH:mm') : 'Nunca';
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        // Não permitir excluir o usuário atual
        const isCurrentUser = row.original.id === currentAuthUser?.id;
        
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => editUser(row.original)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => deleteUser(row.original.id)}
              disabled={isCurrentUser}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Gerenciar Usuários</h1>
        <Button onClick={addNewUser}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">Carregando usuários...</div>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          filterPlaceholder="Buscar por email..."
        />
      )}
      
      <UserForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={saveUser}
        isEditing={isEditing}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Users;
