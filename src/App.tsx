import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Users from '@/pages/Users';
import Turmas from '@/pages/Turmas';
import Chamadas from '@/pages/Chamadas';
import Statistics from '@/pages/Statistics';
import EscolaPerfil from '@/pages/EscolaPerfil';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <div className="flex h-screen">
                      <Sidebar />
                      <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 p-6">
                          <Dashboard />
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="flex h-screen">
                      <Sidebar />
                      <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 p-6">
                          <Dashboard />
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute requireAdmin>
                    <div className="flex h-screen">
                      <Sidebar />
                      <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 p-6">
                          <Users />
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/turmas"
                element={
                  <ProtectedRoute>
                    <div className="flex h-screen">
                      <Sidebar />
                      <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 p-6">
                          <Turmas />
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chamadas"
                element={
                  <ProtectedRoute>
                    <div className="flex h-screen">
                      <Sidebar />
                      <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 p-6">
                          <Chamadas />
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/statistics"
                element={
                  <ProtectedRoute requireAdmin>
                    <div className="flex h-screen">
                      <Sidebar />
                      <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 p-6">
                          <Statistics />
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/escola-perfil"
                element={
                  <ProtectedRoute requireAdmin>
                    <div className="flex h-screen">
                      <Sidebar />
                      <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 p-6">
                          <EscolaPerfil />
                        </main>
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
