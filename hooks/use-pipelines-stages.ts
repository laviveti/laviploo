"use client";

import { useQuery } from "@tanstack/react-query";

interface Pipeline {
  Id: number;
  Name: string;
}

interface Stage {
  Id: number;
  Name: string;
  PipelineId: number;
}

interface PipelinesStagesData {
  pipelines: Record<number, string>;
  stages: Record<number, { name: string; pipelineId: number }>;
}

async function fetchPipelinesAndStages(): Promise<PipelinesStagesData> {
  // Fetch pipelines and stages in parallel
  const [pipelinesResponse, stagesResponse] = await Promise.all([
    fetch("/api/pipelines", { cache: "no-cache" }),
    fetch("/api/stages", { cache: "no-cache" })
  ]);

  if (!pipelinesResponse.ok) {
    throw new Error(`Failed to fetch pipelines: ${pipelinesResponse.statusText}`);
  }

  if (!stagesResponse.ok) {
    throw new Error(`Failed to fetch stages: ${stagesResponse.statusText}`);
  }

  const [pipelinesData, stagesData] = await Promise.all([
    pipelinesResponse.json(),
    stagesResponse.json()
  ]);

  // Transform to lookup maps
  const pipelines: Record<number, string> = {};
  const stages: Record<number, { name: string; pipelineId: number }> = {};

  pipelinesData.value?.forEach((pipeline: Pipeline) => {
    pipelines[pipeline.Id] = pipeline.Name;
  });

  stagesData.value?.forEach((stage: Stage) => {
    stages[stage.Id] = {
      name: stage.Name,
      pipelineId: stage.PipelineId
    };
  });

  return { pipelines, stages };
}

export function usePipelinesStages() {
  return useQuery({
    queryKey: ['pipelines-stages'],
    queryFn: fetchPipelinesAndStages,
    // Cache for 10 minutes since pipelines/stages don't change frequently
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

// Helper hook to get pipeline name from stage ID
export function usePipelineFromStage(stageId?: number) {
  const { data } = usePipelinesStages();
  
  if (!stageId || !data) return null;
  
  const stage = data.stages[stageId];
  if (!stage) return null;
  
  return {
    pipelineName: data.pipelines[stage.pipelineId],
    stageName: stage.name,
    pipelineId: stage.pipelineId
  };
}