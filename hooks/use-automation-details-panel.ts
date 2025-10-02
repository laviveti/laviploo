import { useQueryState } from "nuqs";
import { parseAsInteger } from "nuqs";

export function useAutomationDetailsPanel() {
  const [selectedAutomationId, setSelectedAutomationId] = useQueryState(
    "details",
    parseAsInteger
  );

  const openDetails = (automationId: number) => {
    setSelectedAutomationId(automationId);
  };

  const closeDetails = () => {
    setSelectedAutomationId(null);
  };

  const toggleDetails = (automationId?: number) => {
    if (selectedAutomationId === automationId) {
      closeDetails();
    } else if (automationId) {
      openDetails(automationId);
    }
  };

  return {
    selectedAutomationId,
    isOpen: selectedAutomationId !== null,
    openDetails,
    closeDetails,
    toggleDetails,
  };
}