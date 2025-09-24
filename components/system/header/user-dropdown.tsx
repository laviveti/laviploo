"use client";

import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

interface UserDropdownProps {
  className?: string;
}

export const UserDropdown = ({ className }: UserDropdownProps) => {
  const { user, signOut, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className='h-8 w-8 rounded-full bg-zinc-300 animate-pulse' />;
  }

  if (!user) {
    return null;
  }

  const getUserInitials = (email: string) => {
    const parts = email.split("@")[0].split(".");
    if (parts.length >= 2) {
      return `${parts[0][0]?.toUpperCase()}${parts[1][0]?.toUpperCase()}`;
    }
    return email[0]?.toUpperCase() || "U";
  };

  const handleSignOut = async () => {
    try {
      // Salva token trusted device para silent reauthentication
      if (typeof document !== 'undefined' && user?.email) {
        const trustedToken = `trusted_${Date.now()}_${Math.random().toString(36)}`;
        const trustedDeviceData = {
          email: user.email,
          timestamp: Date.now(),
          userAgent: navigator.userAgent.substring(0, 100),
          token: trustedToken,
        };

        const cookieValue = encodeURIComponent(JSON.stringify(trustedDeviceData));
        const maxAge = 5 * 60; // 5 minutos em segundos
        document.cookie = `trusted_device=${cookieValue}; max-age=${maxAge}; path=/; secure; samesite=strict`;

        console.log("💾 Trusted device token salvo para silent auth:", trustedToken);
      }

      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-semibold' size='sm'>
          {getUserInitials(user.email)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>{user.name || "Usuário"}</p>
            <p className='text-xs leading-none text-muted-foreground'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className='cursor-pointer'>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
