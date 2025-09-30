import { create } from 'zustand';

/**
 * Store para navegação entre automações
 *
 * IMPORTANTE: targetEntityId é o ID VISUAL da UI (do constants),
 * NÃO o EntityId do Ploomes! Use getVisualEntityId() para converter.
 */
interface AutomationNavigationState {
  targetAutomationId: number | null;
  targetEntityId: number | null; // ID visual da UI, não EntityId do Ploomes
  shouldOpenDetails: boolean;
  shouldClearFilters: boolean; // Indica se deve limpar filtros antes de navegar
  skipPageReset: boolean; // Previne reset automático de página durante navegação
  setTargetAutomation: (automationId: number, visualEntityId: number | null, openDetails?: boolean, clearFilters?: boolean) => void;
  clearTarget: () => void;
}

export const useAutomationNavigationStore = create<AutomationNavigationState>((set) => ({
  targetAutomationId: null,
  targetEntityId: null,
  shouldOpenDetails: false, // Padrão: não abrir painel, apenas highlight
  shouldClearFilters: false, // Padrão: não limpar filtros
  skipPageReset: false, // Padrão: permitir reset de página
  setTargetAutomation: (automationId, visualEntityId, openDetails = false, clearFilters = false) =>
    set({
      targetAutomationId: automationId,
      targetEntityId: visualEntityId,
      shouldOpenDetails: openDetails,
      shouldClearFilters: clearFilters,
      skipPageReset: true, // Ativar skip quando navegando para automação específica
    }),
  clearTarget: () =>
    set({
      targetAutomationId: null,
      targetEntityId: null,
      shouldOpenDetails: false,
      shouldClearFilters: false,
      skipPageReset: false, // Resetar skip ao limpar target
    }),
}));