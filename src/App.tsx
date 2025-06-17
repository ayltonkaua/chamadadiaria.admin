import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Páginas
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Users from "./pages/Users";
import Alerts from "./pages/Alerts";
import Classes from "./pages/Classes";
import Attendances from "./pages/Attendances";
import NotFound from "./pages/NotFound";
import Statistics from '@/pages/Statistics';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Redirecionar a raiz para o dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rota pública de login */}
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas dentro do layout do dashboard */}
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="students" element={<Students />} />
              <Route path="classes" element={<Classes />} />
              <Route path="attendances" element={<Attendances />} />
              <Route path="alerts" element={<Alerts />} />
              
              {/* Rotas que exigem acesso de administrador */}
              <Route path="users" element={
                <ProtectedRoute requireAdmin={true}>
                  <Users />
                </ProtectedRoute>
              } />
              <Route path="statistics" element={
                <ProtectedRoute requireAdmin={true}>
                  <Statistics />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
