import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/handle-error";

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Accept": "application/json",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const filterId = parseInt(id);
    
    if (isNaN(filterId)) {
      return NextResponse.json(
        { error: "ID do filtro inválido" },
        { status: 400 }
      );
    }

    // Buscar o filtro com todas as expansões possíveis
    const response = await fetch(
      `${PLOOMES_API_BASE}/Filters?$filter=Id eq ${filterId}&$expand=AllowedUsers,AllowedTeams,Fields`,
      {
        headers,
        cache: "no-cache",
      }
    );

    if (!response.ok) {
      throw new Error(`API Ploomes returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Retornar dados brutos para debug
    return NextResponse.json({
      debug: true,
      filterId,
      rawData: data,
      message: "Dados brutos do filtro para análise"
    });
  } catch (error) {
    console.error(`Erro ao buscar filtro ${params}:`, error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}