import { useTheme } from "@/hooks/useTheme";
import { Toaster } from "sonner";

function ThemedToaster() {
  const { theme } = useTheme();

  return <Toaster richColors position="top-center" theme={theme} />;
}

export default ThemedToaster;
