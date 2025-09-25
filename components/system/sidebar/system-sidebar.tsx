"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import React from "react";
import { LogoFull } from "../logo";
import { cn } from "@/lib/utils";

interface SystemSidebarProps extends React.ComponentProps<"aside"> {}

export const SystemSidebar = ({ className }: SystemSidebarProps) => {
  const { signOut } = useAuth();

  return (
    <aside className={cn("w-45 flex flex-col px-0.5 py-2 bg-gradient-to-b from-lavive to-rose-600 h-full", className)}>
      {/* Sidebar */}
      <div className='bg-white p-1 px-4 flex items-center justify-center self-center rounded-md w-fit h-fit'>
        <LogoFull size='md' />
      </div>
    </aside>
  );
};
