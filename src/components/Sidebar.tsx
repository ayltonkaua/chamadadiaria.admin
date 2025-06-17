import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings,
  School
} from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();

  const links = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Usuários',
      href: '/users',
      icon: Users,
      adminOnly: true
    },
    {
      title: 'Turmas',
      href: '/turmas',
      icon: BookOpen,
    },
    {
      title: 'Chamadas',
      href: '/chamadas',
      icon: Calendar,
    },
    {
      title: 'Estatísticas',
      href: '/statistics',
      icon: Settings,
      adminOnly: true
    },
    {
      title: 'Perfil da Escola',
      href: '/escola-perfil',
      icon: School,
      adminOnly: true
    }
  ];

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Menu
          </h2>
          <ScrollArea className="h-[300px] px-2">
            <div className="space-y-1">
              {links.map((link) => {
                if (link.adminOnly && user?.role !== 'admin') return null;
                
                const Icon = link.icon;
                return (
                  <Button
                    key={link.href}
                    variant="ghost"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link to={link.href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {link.title}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
} 