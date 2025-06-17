import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  School,
  LogOut,
} from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkUserRole() {
      if (user) {
        const { data } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        setIsAdmin(data?.role === 'admin');
      }
    }

    checkUserRole();
  }, [user]);

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      adminOnly: false,
    },
    {
      title: 'Usuários',
      path: '/users',
      icon: Users,
      adminOnly: true,
    },
    {
      title: 'Turmas',
      path: '/turmas',
      icon: BookOpen,
      adminOnly: false,
    },
    {
      title: 'Chamadas',
      path: '/chamadas',
      icon: Calendar,
      adminOnly: false,
    },
    {
      title: 'Estatísticas',
      path: '/statistics',
      icon: BarChart3,
      adminOnly: true,
    },
    {
      title: 'Perfil da Escola',
      path: '/escola-perfil',
      icon: School,
      adminOnly: true,
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col bg-background border-r">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-semibold">Admin Chamada</h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {menuItems.map((item) => {
            if (item.adminOnly && !isAdmin) return null;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground',
                  location.pathname === item.path && 'bg-muted text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
  );
} 