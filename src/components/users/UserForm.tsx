
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Usuario } from '@/lib/services/usuariosService';

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (userData: { id?: string, email: string, password?: string, role: string }) => Promise<void>;
  isEditing: boolean;
  currentUser: Partial<Usuario & { password?: string }>;
}

const UserForm: React.FC<UserFormProps> = ({
  open,
  onOpenChange,
  onSave,
  isEditing,
  currentUser
}) => {
  const [userData, setUserData] = useState<Partial<Usuario & { password?: string }>>(currentUser);
  const [loading, setLoading] = useState(false);

  // Atualizar formulário quando o usuário atual mudar
  useEffect(() => {
    setUserData({ ...currentUser, password: '' });
  }, [currentUser]);

  const handleSave = async () => {
    try {
      if (!isEditing && (!userData.email || !userData.password)) {
        alert('Por favor, preencha o email e a senha.');
        return;
      }
      
      if (isEditing && !userData.email) {
        alert('Por favor, preencha o email.');
        return;
      }

      setLoading(true);
      await onSave({
        id: userData.id,
        email: userData.email || '',
        password: userData.password,
        role: userData.role || 'user'
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={userData.email || ''}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              disabled={isEditing} // Email não pode ser alterado na edição
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">
              {isEditing ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha'}
            </Label>
            <Input
              id="password"
              type="password"
              value={userData.password || ''}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Função</Label>
            <Select 
              value={userData.role} 
              onValueChange={(value) => setUserData({ ...userData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="user">Usuário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Adicionar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
