import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2, Plus, Shield, User, Clock, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { usuariosService, Usuario } from '@/lib/services/usuariosService';
import UserForm from '@/components/users/UserForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        await usuariosService.update(userData.id, userData);
        setUsers(prev => prev.map(user => 
          user.id === userData.id ? { ...user, ...userData } : user
        ));
        
        toast({
          title: 'Usuário atualizado',
          description: 'As alterações foram salvas com sucesso.',
        });
      } else {
        const newUser = await usuariosService.create(userData);
        setUsers(prev => [...prev, newUser]);
        
        toast({
          title: 'Usuário criado',
          description: 'O novo usuário foi adicionado com sucesso.',
        });
      }
      
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
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

  // Estatísticas de usuários
  const userStats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    regular: users.filter(u => u.role === 'user').length,
    active: users.filter(u => u.updated_at && new Date(u.updated_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
  };

  // Definir colunas da tabela
  const columns: ColumnDef<Usuario>[] = [
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue('email')}</span>
        </div>
      ),
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
        return (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{date ? format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'N/A'}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'updated_at',
      header: 'Último login',
      cell: ({ row }) => {
        const date = row.getValue('updated_at') as string;
        return (
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{date ? format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: ptBR }) : 'Nunca'}</span>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const isCurrentUser = row.original.id === currentAuthUser?.id;
        
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => editUser(row.original)} title="Editar">
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => deleteUser(row.original.id)}
              disabled={isCurrentUser}
              title={isCurrentUser ? "Não é possível excluir seu próprio usuário" : "Excluir"}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
        <Button onClick={addNewUser}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista de Usuários</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {loading ? (
            <div className="flex justify-center py-8">Carregando usuários...</div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              filterPlaceholder="Buscar por email..."
            />
          )}
        </TabsContent>

        <TabsContent value="stats">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  Usuários registrados no sistema
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.admins}</div>
                <p className="text-xs text-muted-foreground">
                  Usuários com acesso administrativo
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Regulares</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.regular}</div>
                <p className="text-xs text-muted-foreground">
                  Usuários com acesso básico
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.active}</div>
                <p className="text-xs text-muted-foreground">
                  Usuários ativos nos últimos 30 dias
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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
