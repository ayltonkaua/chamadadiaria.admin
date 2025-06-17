import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface UserRole {
  user_id: string;
  role: string;
}

interface Attendance {
  id: string;
  aluno_id: string;
  turma_id: string;
  data_chamada: string;
  presente: boolean;
  falta_justificada: boolean;
  created_at: string;
}

const Statistics: React.FC = () => {
  // Buscar dados de usuários
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['users-stats'],
    queryFn: async () => {
      const { data: users, error } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (error) throw error;
      return users as UserRole[];
    }
  });

  // Buscar dados de presença
  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ['attendance-stats'],
    queryFn: async () => {
      // Buscar presenças dos últimos 7 dias
      const sevenDaysAgo = subDays(new Date(), 7);
      const { data: attendance, error } = await supabase
        .from('presencas')
        .select('*')
        .gte('data_chamada', sevenDaysAgo.toISOString())
        .order('data_chamada', { ascending: true });

      if (error) throw error;
      return attendance as Attendance[];
    }
  });

  // Processar dados para gráficos
  const processUserData = () => {
    if (!usersData) return [];

    const roleCount = usersData.reduce((acc: any, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(roleCount).map(([role, count]) => ({
      name: role === 'admin' ? 'Administradores' : 'Usuários',
      value: count
    }));
  };

  const processAttendanceData = () => {
    if (!attendanceData) return [];

    // Inicializar dados para os últimos 7 dias
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date: format(date, 'dd/MM/yyyy'),
        presenca: 0,
        falta: 0
      };
    }).reverse();

    // Preencher com dados reais
    attendanceData.forEach(record => {
      const date = format(new Date(record.data_chamada), 'dd/MM/yyyy');
      const dayData = last7Days.find(d => d.date === date);
      if (dayData) {
        if (record.presente) {
          dayData.presenca++;
        } else {
          dayData.falta++;
        }
      }
    });

    return last7Days;
  };

  if (usersLoading || attendanceLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Carregando estatísticas...</div>
      </div>
    );
  }

  const userData = processUserData();
  const attendanceDataProcessed = processAttendanceData();

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Estatísticas do Sistema</h1>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="attendance">Presenças</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Usuários por Função</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={userData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {userData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {usersData?.length || 0}
                </div>
                <p className="text-muted-foreground">
                  Usuários registrados no sistema
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Presenças dos Últimos 7 Dias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceDataProcessed}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="presenca" name="Presenças" fill="#4CAF50" />
                    <Bar dataKey="falta" name="Faltas" fill="#F44336" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics; 