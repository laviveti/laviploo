"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ArrowRight, Bot, Clock, User, Zap, AlertCircle, History, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGlobalAutomationSearch } from "@/hooks/use-global-automation-search";
import type { SearchResult } from "@/app/api/automations/search/route";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface GlobalAutomationSearchProps {
  onAutomationSelect?: (automation: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-zinc-100 text-zinc-600 border-zinc-200';
    case 'error':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-zinc-100 text-zinc-600 border-zinc-200';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'active':
      return <Zap className="h-3 w-3" />;
    case 'inactive':
      return <Clock className="h-3 w-3" />;
    case 'error':
      return <AlertCircle className="h-3 w-3" />;
    default:
      return <Bot className="h-3 w-3" />;
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'active':
      return 'Ativa';
    case 'inactive':
      return 'Inativa';
    case 'error':
      return 'Erro';
    default:
      return 'Desconhecido';
  }
}

const SEARCH_HISTORY_KEY = 'automation_search_history';
const MAX_HISTORY_ITEMS = 10;

// Hook para gerenciar histórico de pesquisa
function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // Carregar histórico do localStorage
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading search history:', e);
      }
    }
  }, []);

  const addToHistory = (query: string) => {
    if (!query.trim() || query.length < 2) return;

    setHistory(prev => {
      // Remover duplicatas e adicionar no topo
      const filtered = prev.filter(item => item !== query);
      const newHistory = [query, ...filtered].slice(0, MAX_HISTORY_ITEMS);

      // Salvar no localStorage
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));

      return newHistory;
    });
  };

  const removeFromHistory = (query: string) => {
    setHistory(prev => {
      const newHistory = prev.filter(item => item !== query);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  };

  return { history, addToHistory, removeFromHistory, clearHistory };
}

export function GlobalAutomationSearch({
  onAutomationSelect,
  placeholder = "Busque automações em qualquer lugar...",
  className
}: GlobalAutomationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const { history, addToHistory, removeFromHistory } = useSearchHistory();

  const {
    results,
    isLoading,
    query,
    setQuery,
    total,
    clearSearch
  } = useGlobalAutomationSearch({
    enabled: isOpen,
    debounceMs: 200,
    minQueryLength: 1
  });

  useEffect(() => {
    if (results.length > 0 && selectedIndex >= results.length) {
      setSelectedIndex(results.length - 1);
    }
  }, [results.length, selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleAutomationSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleAutomationSelect = (automation: SearchResult) => {
    console.log('[GLOBAL_SEARCH] handleAutomationSelect called', {
      automationId: automation.id,
      entityId: automation.entityId,
      automationName: automation.name,
      hasCallback: !!onAutomationSelect
    });

    // Adicionar ao histórico antes de navegar
    if (query) {
      addToHistory(query);
    }

    setIsOpen(false);
    setSelectedIndex(-1);
    // NÃO limpar a busca, apenas fechar o dropdown
    // clearSearch();
    
    console.log('[GLOBAL_SEARCH] Calling onAutomationSelect callback');
    onAutomationSelect?.(automation);
  };

  const handleHistoryItemClick = (historyQuery: string) => {
    setQuery(historyQuery);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay to allow clicking on results
    setTimeout(() => {
      if (!resultsRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }, 150);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    // Split query into multiple terms
    const terms = query.split(/\s+/).filter(term => term.length > 0);

    // Escape special regex characters and join with OR operator
    const escapedTerms = terms.map(term =>
      term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );

    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      // Check if this part matches any of the search terms
      const isMatch = terms.some(term =>
        part.toLowerCase() === term.toLowerCase()
      );

      return isMatch ?
        <mark key={index} className="bg-rose-100 text-rose-900 px-0.5 rounded-sm">{part}</mark> :
        part;
    });
  };

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 text-zinc-400 transform -translate-y-1/2" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 h-10 text-sm border-zinc-300 focus:border-rose-300 focus:ring-rose-200 rounded-md shadow-sm"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.length > 0 || results.length > 0) && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md border border-zinc-200 shadow-xl z-50 max-h-96 overflow-y-auto"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="p-3 text-center text-sm text-zinc-500">
              <Bot className="h-4 w-4 mx-auto mb-1 animate-pulse" />
              Buscando automações...
            </div>
          )}

          {/* No Results - Only show when not loading and there are truly no results */}
          {!isLoading && query.length > 0 && results.length === 0 && (
            <div className="p-3 text-center text-sm text-zinc-500">
              <Search className="h-4 w-4 mx-auto mb-1 text-zinc-400" />
              Nenhuma automação encontrada para "{query}"
            </div>
          )}

          {/* Search Results */}
          {!isLoading && results.length > 0 && (
            <>
              {/* Results Header */}
              <div className="px-3 py-2 border-b border-zinc-100 bg-zinc-50">
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <span>{total} automaç{total !== 1 ? 'ões' : 'ão'} encontrada{total !== 1 ? 's' : ''}</span>
                  <span className="text-zinc-400">↑↓ para navegar • Enter para abrir</span>
                </div>
              </div>

              {/* Results List */}
              <div className="py-1">
                {results.map((automation, index) => (
                  <button
                    key={automation.id}
                    onClick={() => handleAutomationSelect(automation)}
                    className={cn(
                      "w-full px-3 py-2 text-left hover:bg-zinc-50 focus:bg-zinc-50 focus:outline-none transition-colors",
                      selectedIndex === index && "bg-zinc-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Main Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title and Status */}
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-zinc-900 truncate">
                            {highlightMatch(automation.name, query)}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn("text-xs px-1.5 py-0.5 h-5", getStatusColor(automation.status))}
                          >
                            {getStatusIcon(automation.status)}
                            <span className="ml-1">{getStatusText(automation.status)}</span>
                          </Badge>
                        </div>

                        {/* Matched Content */}
                        <div className="text-xs text-zinc-600 mb-1">
                          {highlightMatch(automation.matchedContent, query)}
                        </div>

                        {/* Metadata with smart highlighting */}
                        <div className="flex items-center gap-3 text-xs">
                          <span className={cn(
                            "flex items-center gap-1 transition-colors",
                            automation.matchedFields.includes('entidade')
                              ? "text-rose-600 animate-pulse font-medium"
                              : "text-zinc-500"
                          )}>
                            <Bot className="h-3 w-3" />
                            {automation.entityName}
                          </span>
                          {automation.creator && (
                            <span className={cn(
                              "flex items-center gap-1 transition-colors",
                              automation.matchedFields.includes('criador')
                                ? "text-rose-600 animate-pulse font-medium"
                                : "text-zinc-500"
                            )}>
                              <User className="h-3 w-3" />
                              {automation.creator}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-zinc-500">
                            <Clock className="h-3 w-3" />
                            {format(new Date(automation.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                          </span>
                        </div>

                        {/* Matched Fields Tags with pulse animation */}
                        {automation.matchedFields.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {automation.matchedFields.map((field) => (
                              <Badge
                                key={field}
                                variant="secondary"
                                className="text-xs px-1.5 py-0 h-4 bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
                              >
                                {field}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Arrow Icon */}
                      <ArrowRight className="h-3 w-3 text-zinc-400 mt-1 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Search History */}
          {!isLoading && query.length === 0 && history.length > 0 && (
            <>
              <div className="px-3 py-2 border-b border-zinc-100 bg-zinc-50">
                <div className="flex items-center justify-between text-xs text-zinc-600">
                  <span className="flex items-center gap-1">
                    <History className="h-3 w-3" />
                    Pesquisas recentes
                  </span>
                </div>
              </div>
              <div className="py-1">
                {history.map((historyItem, index) => (
                  <div
                    key={index}
                    className="w-full px-3 py-2 hover:bg-zinc-50 transition-colors group cursor-pointer"
                    onClick={() => handleHistoryItemClick(historyItem)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Clock className="h-3 w-3 text-zinc-400 shrink-0" />
                        <span className="text-sm text-zinc-700 truncate">{historyItem}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(historyItem);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-200 rounded transition-opacity"
                        aria-label="Remover do histórico"
                      >
                        <X className="h-3 w-3 text-zinc-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Helper Text */}
          {!isLoading && query.length === 0 && history.length === 0 && (
            <div className="p-3 text-center text-sm text-zinc-500">
              <Search className="h-4 w-4 mx-auto mb-1 text-zinc-400" />
              Digite para buscar automações
            </div>
          )}
        </div>
      )}
    </div>
  );
}