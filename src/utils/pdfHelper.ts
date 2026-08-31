import { format } from 'date-fns';
import type { AtividadeData } from '../services/atividades';

export function getPdfFilename(atividade: AtividadeData): string {
  // Mapeamento da duração para texto com Grupo (Bloco)
  let duracaoText = atividade.duracao;
  
  if (atividade.duracao === "09:20 às 10:15") {
    duracaoText = "Manhã Grupo I";
  } else if (atividade.duracao === "10:40 às 12:00") {
    duracaoText = "Manhã Grupo II";
  } else if (atividade.duracao === "14:20 às 16:00") {
    duracaoText = "Tarde";
  }

  // Montar nome exatamente como pedido: [Data] [Local] [Duração traduzida para Grupo]
  const dataFormatada = atividade.data ? format(new Date(atividade.data), 'dd-MM') : '';
  const rawName = `${dataFormatada} ${atividade.local} ${duracaoText}`.trim();
  
  // Limpar caracteres inválidos para nomes de ficheiros Windows
  const safeName = rawName.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, ' ');
  
  return `${safeName}.pdf`;
}
