/**
 * Traduz valores especiais de filtros do Ploomes para formato legível
 */
export function translateFilterValue(value: string): string {
  // $nextndays(n) -> próximos n dias
  const nextDaysMatch = value.match(/\$nextndays\((\d+)\)/i);
  if (nextDaysMatch) {
    const days = parseInt(nextDaysMatch[1]);
    return days === 1 ? "próximo dia" : `próximos ${days} dias`;
  }

  // Adicionar outras traduções conforme necessário
  return value;
}
