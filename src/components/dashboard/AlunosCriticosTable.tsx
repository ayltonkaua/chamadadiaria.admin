import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AlunosCriticosTableProps {
  data: Array<{
    aluno_id: string;
    aluno_nome: string;
    matricula: string;
    turma_nome: string;
    total_faltas: number;
  }>;
}

export default function AlunosCriticosTable({ data }: AlunosCriticosTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alunos em Situação Crítica</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Turma</TableHead>
              <TableHead className="text-right">Total de Faltas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((aluno) => (
              <TableRow key={aluno.aluno_id}>
                <TableCell className="font-medium">{aluno.aluno_nome}</TableCell>
                <TableCell>{aluno.matricula}</TableCell>
                <TableCell>{aluno.turma_nome}</TableCell>
                <TableCell className="text-right">{aluno.total_faltas}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  Nenhum aluno em situação crítica
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
