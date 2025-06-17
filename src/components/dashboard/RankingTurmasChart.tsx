import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { TrendingDown } from 'lucide-react';

interface RankingTurmasChartProps {
  data: Array<{
    turma_nome: string;
    alunos_com_mais_9_faltas: number;
    turma_id: string;
  }>;
}

const chartConfig = {
  alunos_com_mais_9_faltas: {
    label: "Alunos com +9 Faltas",
    color: "hsl(0, 84%, 60%)",
  },
};

export default function RankingTurmasChart({ data }: RankingTurmasChartProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Turmas com Alunos Mais Faltosos (+9 Faltas)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        {data.length === 0 ? (
          <div className="flex justify-center items-center h-[200px] sm:h-[280px]">
            <p className="text-muted-foreground text-sm">Nenhuma turma com alunos com mais de 9 faltas</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] sm:h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data.slice(0, 10)} 
                layout="vertical"
                margin={{ top: 10, right: 10, left: 40, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  type="category" 
                  dataKey="turma_nome" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  type="number" 
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-lg text-xs">
                          <p className="font-medium">{label}</p>
                          <p className="text-red-600">
                            {payload[0].value} aluno{payload[0].value !== 1 ? 's' : ''} com +9 faltas
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="alunos_com_mais_9_faltas" 
                  fill={chartConfig.alunos_com_mais_9_faltas.color}
                  radius={[0, 2, 2, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
