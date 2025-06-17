import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Clock } from 'lucide-react';

interface DistribuicaoTurnoChartProps {
  data: Array<{
    turno: string;
    faltas: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const chartConfig = {
  faltas: {
    label: "Faltas",
    color: "hsl(var(--chart-1))",
  },
};

export default function DistribuicaoTurnoChart({ data }: DistribuicaoTurnoChartProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Distribuição de Faltas por Turno</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="faltas"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg text-xs">
                        <p className="font-medium">{data.turno}</p>
                        <p className="text-muted-foreground">
                          Faltas: {data.faltas}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }}
                iconSize={6}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
