
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para formatar data no formato do banco de dados (YYYY-MM-DD)
export function formatToDBDate(date: Date | string): string {
  if (typeof date === 'string') {
    // Se a data já estiver no formato correto, apenas retorna
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    // Caso contrário, converte para Date primeiro
    date = new Date(date);
  }
  
  return format(date, 'yyyy-MM-dd');
}

// Função para formatar data para exibição ao usuário
export function formatToDisplayDate(date: Date | string): string {
  if (typeof date === 'string') {
    // Converter para objeto Date
    date = new Date(date);
  }
  
  return format(date, 'yyyy-MM-dd');
}
