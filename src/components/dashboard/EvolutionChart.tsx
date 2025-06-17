import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface EvolutionChartProps {
  data: {
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

export default function EvolutionChart({ data }: EvolutionChartProps) {
  const getTendenciaIcon = () => {
    switch (data.tendencia) {
      case 'subindo':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'descendo':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getTendenciaIcon()}
            Evolução da Frequência
          </CardTitle>
          <div className="flex items-center gap-2">
            {getTendenciaIcon()}
            <span className="text-sm text-muted-foreground">
              {data.tendencia === 'subindo' ? 'Tendência positiva' : 
               data.tendencia === 'descendo' ? 'Tendência negativa' : 
               'Tendência estável'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data.presencas_por_mes}
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
}
