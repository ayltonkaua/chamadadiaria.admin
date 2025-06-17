
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  BarChart, 
  Users, 
  Calendar, 
  UserCog, 
  BookOpen, 
  AlertTriangle,
  LogOut,
  Menu,
  X,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar: React.FC<{ collapsed: boolean, toggleSidebar: () => void }> = ({ collapsed, toggleSidebar }) => {
  const { signOut, isAdmin } = useAuth();
  const isMobile = useIsMobile();
  
  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: <Home className="h-5 w-5" /> },
    { title: 'Alunos', path: '/students', icon: <Users className="h-5 w-5" /> },
    { title: 'Turmas', path: '/classes', icon: <BookOpen className="h-5 w-5" /> },
    { title: 'Chamadas', path: '/attendances', icon: <Calendar className="h-5 w-5" /> },
    { title: 'Alertas', path: '/alerts', icon: <AlertTriangle className="h-5 w-5" /> },
  ];

   // Menu adicional apenas para administradores
  const adminMenuItems = [
    { title: 'Usuários', path: '/users', icon: <UserCog className="h-5 w-5" /> },
    { title: 'Estatísticas', path: '/statistics', icon: <BarChart className="h-5 w-5" /> },
  ];

  if (isMobile) {
    return (
      <div className={`fixed inset-0 z-50 lg:hidden ${collapsed ? 'pointer-events-none' : ''}`}>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/50 transition-opacity ${collapsed ? 'opacity-0' : 'opacity-100'}`}
          onClick={toggleSidebar}
        />
        
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform ${
            collapsed ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="text-lg font-bold text-primary">Chamada Diária</div>
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-3 rounded-md transition-colors text-sm ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-600 hover:bg-secondary'
                  }`
                }
                onClick={toggleSidebar}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </NavLink>
            ))}

            {isAdmin && (
              <>
                <div className="my-4 border-t mx-4"></div>
                {adminMenuItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => 
                      `flex items-center px-4 py-3 rounded-md transition-colors text-sm ${
                        isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-gray-600 hover:bg-secondary'
                      }`
                    }
                    onClick={toggleSidebar}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </NavLink>
                ))}
              </>
            )}
          </nav>

          <div className="p-4 border-t mt-auto">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sm" 
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Sair</span>
            </Button>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <aside 
      className={`sidebar fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ${
        collapsed ? 'sidebar-collapsed' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="text-xl font-bold text-primary">Chamada Diária</div>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-gray-600 hover:bg-secondary'
              }`
            }
          >
            {item.icon}
            {!collapsed && <span className="ml-3">{item.title}</span>}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className={`my-4 border-t ${collapsed ? 'mx-2' : 'mx-4'}`}></div>
            {adminMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center px-4 py-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-gray-600 hover:bg-secondary'
                  }`
                }
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.title}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="p-4 border-t mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </aside>
  );
};

const DashboardLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      
      <main className={`transition-all duration-300 ${
        isMobile ? 'ml-0' : sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="container px-2 py-2 sm:px-4 sm:py-4 lg:px-6 lg:py-8 max-w-full">
          {isMobile && (
            <div className="flex items-center mb-4 p-2">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">Chamada Diária</h1>
            </div>
          )}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
