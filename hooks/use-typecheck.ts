"use client";

import { useState, useCallback } from "react";

export interface TypecheckResult {
  success: boolean;
  output: string;
  errors: TypecheckError[];
  warnings: TypecheckError[];
  duration: number;
  timestamp: Date;
}

export interface TypecheckError {
  file: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  code?: string;
}

export interface TypecheckState {
  isRunning: boolean;
  result: TypecheckResult | null;
  lastRun: Date | null;
  hasErrors: boolean;
  errorCount: number;
  warningCount: number;
}

export const useTypecheck = () => {
  const [state, setState] = useState<TypecheckState>({
    isRunning: false,
    result: null,
    lastRun: null,
    hasErrors: false,
    errorCount: 0,
    warningCount: 0,
  });

  const runTypecheck = useCallback(async (): Promise<TypecheckResult> => {
    setState(prev => ({ ...prev, isRunning: true }));

    const startTime = Date.now();

    try {
      // Simula execução do pnpm typecheck
      // Em produção, isso seria executado via API route que chama o comando
      const response = await fetch("/api/dev/typecheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          command: "pnpm typecheck",
          cwd: process.cwd(),
        }),
        cache: "no-cache",
      });

      const data = await response.json();
      const duration = Date.now() - startTime;
      const timestamp = new Date();

      const errors: TypecheckError[] = data.errors?.map((error: any) => ({
        file: error.file || "unknown",
        line: error.line || 0,
        column: error.column || 0,
        message: error.message || error.text || "Unknown error",
        severity: error.severity || 'error',
        code: error.code,
      })) || [];

      const warnings: TypecheckError[] = data.warnings?.map((warning: any) => ({
        file: warning.file || "unknown",
        line: warning.line || 0,
        column: warning.column || 0,
        message: warning.message || warning.text || "Unknown warning",
        severity: 'warning' as const,
        code: warning.code,
      })) || [];

      const result: TypecheckResult = {
        success: response.ok && data.success && errors.length === 0,
        output: data.output || "",
        errors,
        warnings,
        duration,
        timestamp,
      };

      setState({
        isRunning: false,
        result,
        lastRun: timestamp,
        hasErrors: errors.length > 0,
        errorCount: errors.length,
        warningCount: warnings.length,
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const timestamp = new Date();

      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao executar typecheck";

      const result: TypecheckResult = {
        success: false,
        output: "",
        errors: [{
          file: "system",
          line: 0,
          column: 0,
          message: errorMessage,
          severity: 'error',
        }],
        warnings: [],
        duration,
        timestamp,
      };

      setState({
        isRunning: false,
        result,
        lastRun: timestamp,
        hasErrors: true,
        errorCount: 1,
        warningCount: 0,
      });

      return result;
    }
  }, []);

  const clearResult = useCallback(() => {
    setState(prev => ({
      ...prev,
      result: null,
      hasErrors: false,
      errorCount: 0,
      warningCount: 0,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isRunning: false,
      result: null,
      lastRun: null,
      hasErrors: false,
      errorCount: 0,
      warningCount: 0,
    });
  }, []);

  const getStatusColor = useCallback(() => {
    if (state.isRunning) return 'blue';
    if (!state.result) return 'gray';
    if (state.hasErrors) return 'red';
    if (state.warningCount > 0) return 'yellow';
    return 'green';
  }, [state]);

  const getStatusText = useCallback(() => {
    if (state.isRunning) return 'Executando...';
    if (!state.result) return 'Não executado';
    if (state.hasErrors) return `${state.errorCount} erro${state.errorCount !== 1 ? 's' : ''}`;
    if (state.warningCount > 0) return `${state.warningCount} aviso${state.warningCount !== 1 ? 's' : ''}`;
    return 'Sem problemas';
  }, [state]);

  const formatDuration = useCallback((ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }, []);

  return {
    ...state,
    runTypecheck,
    clearResult,
    reset,
    getStatusColor,
    getStatusText,
    formatDuration,
  };
};