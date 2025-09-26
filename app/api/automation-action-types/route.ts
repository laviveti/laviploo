import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/handle-error";

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Accept": "application/json",
};

// Mapeamento conhecido de tipos de ações
const ACTION_TYPES = {
  1: "Enviar e-mail",
  2: "Criar tarefa", 
  3: "Alterar estágio",
  4: "Alterar responsável",
  5: "Criar negócio",
  6: "Alterar campo personalizado",
  7: "Webhook",
  8: "Integração externa",
  9: "Enviar notificação",
  10: "Gerar relatório",
  11: "Criar atividade",
  12: "Alterar pipeline",
  13: "Duplicar negócio",
  14: "Arquivar negócio",
  15: "Criar contato",
  16: "Alterar origem",
  17: "Adicionar tag",
  18: "Remover tag",
  19: "Alterar valor",
  20: "Alterar data de fechamento"
};

export async function GET() {
  try {
    // Retornar mapeamento conhecido por enquanto
    // Futuramente pode tentar buscar da API se houver endpoint específico
    
    const actionTypes = Object.entries(ACTION_TYPES).map(([id, name]) => ({
      id: parseInt(id),
      name
    }));
    
    return NextResponse.json({ value: actionTypes });
  } catch (error) {
    console.error("Erro ao buscar tipos de ações:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}