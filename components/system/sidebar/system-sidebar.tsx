"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogoFull } from "../logo";
import { cn } from "@/lib/utils";
import { Home, Settings, Zap, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface SystemSidebarProps extends React.ComponentProps<"aside"> {}

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Integrações",
    href: "/integracoes",
    icon: Zap,
  },
  {
    name: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];

export const SystemSidebar = ({ className }: SystemSidebarProps) => {
  const { signOut } = useAuth();
  const pathname = usePathname();

  return (
    <aside className={cn("w-64 flex flex-col px-3 py-4 bg-gradient-to-b from-lavive to-rose-600 h-full", className)}>
      {/* Logo */}
      <div className='bg-white p-2 px-3 flex items-center justify-center rounded-md mb-6 shadow-sm'>
        <LogoFull size='md' />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-white hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="pt-3 border-t border-white/20">
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start gap-2 text-white hover:bg-white/10 hover:text-white px-3 py-2"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
};