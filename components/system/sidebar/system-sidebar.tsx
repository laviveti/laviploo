"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";
import React from "react";

export const SystemSidebar = () => {
  const { signOut } = useClerk();

  return (
    <aside className='w-45 flex flex-col p-0.5 bg-rose-400 h-full'>
      Sidebar
      <Button onClick={() => signOut()} className='mt-auto'>
        Sair
      </Button>
    </aside>
  );
};
