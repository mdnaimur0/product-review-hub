"use client";

import ThemedToaster from "@/components/ThemedToaster";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <ThemedToaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
