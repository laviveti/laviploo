import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { AUTH_CONFIG } from "@/lib/auth/config";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ClerkProvider
      signInUrl={AUTH_CONFIG.ROUTES.SIGN_IN}
      signUpUrl={AUTH_CONFIG.ROUTES.SIGN_UP}
      afterSignInUrl={AUTH_CONFIG.ROUTES.AFTER_SIGN_IN}
      afterSignUpUrl={AUTH_CONFIG.ROUTES.AFTER_SIGN_UP}
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "bg-white shadow-lg border border-gray-200 rounded-2xl",
        },
        variables: {
          colorPrimary: "#7e22ce",
          colorText: "#374151",
          borderRadius: "0.75rem",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
};
