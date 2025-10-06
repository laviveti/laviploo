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

    // Para termos muito curtos (1-2 chars), buscar início de palavras
    let matched = false;
    if (term.length <= 2) {
      const words = normalizedText.split(/\s+/);
      matched = words.some((word) => word.startsWith(normalizedTerm));
    } else {
      // Para termos normais, buscar substring
      matched = normalizedText.includes(normalizedTerm);
    }

    if (matched) {
      const weight = isTitle ? 3 : 1;
      score += weight;
    }
  });

  return score;
}
