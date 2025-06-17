
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Calendar } from 'lucide-react';

interface FrequenciaDiariaChartProps {
  frequenciaUltimos7Dias: Array<{
    data: string;
    percentual_presenca: number;
    presentes: number;
    faltas: number;
  }>;
}

const chartConfig = {
  percentual_presenca: {
    label: "% Presença",
    color: "hsl(142, 76%, 36%)",
  },
};

export const FrequenciaDiariaChart: React.FC<FrequenciaDiariaChartProps> = ({ 
  frequenciaUltimos7Dias 
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Frequência Diária - Últimos 7 Dias Úteis (%)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={frequenciaUltimos7Dias}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="data" 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis 
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 10 }}
                width={30}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background border rounded-lg p-2 shadow-lg text-xs">
                        <p className="font-medium">{label}</p>
                        <p className="text-green-600">
                          Presença: {data.percentual_presenca.toFixed(1)}%
                        </p>
                        <p className="text-muted-foreground">
                          {data.presentes} presentes, {data.faltas} faltas
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line 
                type="monotone" 
                dataKey="percentual_presenca" 
                stroke={chartConfig.percentual_presenca.color}
                strokeWidth={2}
                dot={{ fill: chartConfig.percentual_presenca.color, strokeWidth: 2, r: 2 }}
                name="% Presença"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
