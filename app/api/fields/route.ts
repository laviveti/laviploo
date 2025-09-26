import { NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/handle-error";

const PLOOMES_API_BASE = process.env.PLOOMES_API_URL || "https://api2.ploomes.com";
const headers = {
  "User-Key": process.env.PLOOMES_API_KEY!,
  "Accept": "application/json",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    const expand = searchParams.get('expand') || 'Type';
    
    let url = `${PLOOMES_API_BASE}/Fields?$expand=${expand}`;
    
    if (entityId) {
      url += `&$filter=EntityId eq ${entityId}`;
    }
    
    const response = await fetch(url, {
      headers,
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`API Ploomes returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erro ao buscar campos:", error);
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}