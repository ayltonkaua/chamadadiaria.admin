
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';

interface EvolutionChartProps {
  dadosUltimosMeses: {
    presencas_por_mes: Array<{
      mes: string;
      percentual_presenca: number;
      total_presencas: number;
      total_faltas: number;
      total_registros: number;
    }>;
    tendencia: 'subindo' | 'descendo' | 'estavel';
  };
}

const chartConfig = {
  percentual_presenca: {
    label: "% Presença",
    color: "hsl(var(--chart-1))",
  },
};

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ dadosUltimosMeses }) => {
  const getTrendColor = () => {
    switch (dadosUltimosMeses.tendencia) {
      case 'subindo': return 'text-green-600';
      case 'descendo': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendText = () => {
    switch (dadosUltimosMeses.tendencia) {
      case 'subindo': return 'Tendência de melhora';
      case 'descendo': return 'Tendência de piora';
      default: return 'Tendência estável';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Evolução da Frequência por Mês
        </CardTitle>
        <div className={`text-xs ${getTrendColor()}`}>
          {getTrendText()}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={dadosUltimosMeses.presencas_por_mes}
              margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="mes" 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <YAxis 
                fontSize={11}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 11 }}
                width={40}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-xs text-muted-foreground">
                          Presença: {data.percentual_presenca.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {data.total_presencas} presenças de {data.total_registros} registros
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="percentual_presenca" 
                stroke="var(--color-percentual_presenca)" 
                strokeWidth={2}
                dot={{ fill: "var(--color-percentual_presenca)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
