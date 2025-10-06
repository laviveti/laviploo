import { normalizeText } from "@/lib/utils";

/**
 * Calcula pontuação de match entre um texto e termos de busca
 * @param text - Texto para buscar
 * @param terms - Termos de busca
 * @param isTitle - Se true, aplica peso 3x maior (para títulos)
 * @returns Pontuação baseada em quantos termos foram encontrados
 */
export function calculateMatchScore(text: string, terms: string[], isTitle: boolean = false): number {
  if (!text) return 0;
  const normalizedText = normalizeText(text);
  let score = 0;

  terms.forEach((term) => {
    const normalizedTerm = normalizeText(term);
    if (normalizedText.includes(normalizedTerm)) {
      const weight = isTitle ? 3 : 1;
      score += weight;
    }
  });

  return score;
}
