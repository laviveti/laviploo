"use client";
import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { InfoIcon, Triangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HintProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  triangleClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  triggerClassName?: string;
  open?: boolean;
  delayDuration?: number;
}

const getTriangleColor = (contentClassName?: string, triangleClassName?: string): string => {
  if (triangleClassName) {
    return triangleClassName;
  }

  if (contentClassName) {
    const colorMap: Record<string, string> = {
      "bg-red-400": "fill-red-400 stroke-red-400",
      "bg-red-500": "fill-red-500 stroke-red-500",
      "bg-emerald-500": "fill-emerald-500 stroke-emerald-500",
      "bg-emerald-600": "fill-emerald-600 stroke-emerald-600",
      "bg-blue-500": "fill-blue-500 stroke-blue-500",
      "bg-amber-500": "fill-amber-500 stroke-amber-500",
      "bg-gray-800": "fill-gray-800 stroke-gray-800",
      "bg-zinc-600": "fill-zinc-600 stroke-zinc-600",
      "bg-zinc-800": "fill-zinc-800 stroke-zinc-800",
    };

    const bgColorMatch = contentClassName.match(/bg-(\w+-\d+)/);
    if (bgColorMatch && colorMap[bgColorMatch[0]]) {
      return colorMap[bgColorMatch[0]];
    }
  }

  return "fill-rose-400 stroke-rose-400";
};

export const Hint: React.FC<HintProps> = ({
  content,
  children,
  side = "top",
  align = "center",
  triggerClassName,
  contentClassName,
  triangleClassName,
  sideOffset = 5,
  delayDuration = 50,
  open,
}) => {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root open={open}>
        <TooltipPrimitive.Trigger asChild className={cn(triggerClassName)}>
          {children}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            sideOffset={sideOffset}
            side={side}
            align={align}
            className={cn("z-10 bg-transparent border-0 p-0 shadow-none overflow-visible", contentClassName)}>
            {!React.isValidElement(content) ? (
              <div
                className={cn("relative flex items-center", {
                  "ml-1": side === "right",
                  "mr-1": side === "left",
                  "mb-1": side === "top",
                  "mt-1": side === "bottom",
                })}>
                <Triangle
                  className={cn(
                    "absolute size-2",
                    {
                      "right-full -mr-0.5 -rotate-90": side === "right",
                      "left-full -ml-0.5 rotate-90": side === "left",
                      "left-1/2 top-full -mt-0.5 -translate-x-1/2 rotate-180": side === "top",
                      "bottom-full left-1/2 -mb-0.5 -translate-x-1/2": side === "bottom",
                    },
                    getTriangleColor(contentClassName)
                  )}
                />
                <p className={cn("rounded-xs bg-rose-400 px-1 py-0.5 text-xs font-medium text-white", contentClassName)}>{content}</p>
              </div>
            ) : (
              content
            )}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};

type HelpHintProps = Omit<HintProps, "children"> & { iconClassName?: string };

export const HelpHint: React.FC<HelpHintProps> = ({
  content,
  side = "right",
  align,
  triggerClassName,
  contentClassName,
  triangleClassName,
  iconClassName,
  sideOffset,
  delayDuration,
  open,
}) => {
  return (
    <Hint
      content={content}
      side={side}
      align={align}
      sideOffset={sideOffset}
      delayDuration={delayDuration}
      open={open}
      contentClassName={cn("w-fit max-w-48 font-semibold", contentClassName)}
      triangleClassName={triangleClassName}
      triggerClassName={triggerClassName}>
      <InfoIcon className={cn("mt-1 size-4 cursor-help stroke-2 text-zinc-500 hover:text-rose-400", iconClassName)} />
    </Hint>
  );
};
