import { BrowserRouter } from "react-router";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider";
import { DiaLogProvider } from "./context/DiaLogProvider";
import { queryConfig } from "./lib/react-query";
import { Router } from "./router/Router";

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DiaLogProvider>
          <BrowserRouter>
            <Router />
            <Toaster />
          </BrowserRouter>
        </DiaLogProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
