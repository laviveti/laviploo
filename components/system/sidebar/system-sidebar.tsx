"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import React from "react";

export const SystemSidebar = () => {
  const { signOut } = useAuth();

  return (
    <aside className='w-45 flex flex-col p-0.5 bg-rose-400 h-full'>
      Sidebar
      <Button onClick={() => signOut()} className='mt-auto'>
        Sair
      </Button>
    </aside>
  );
};
