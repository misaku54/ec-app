import { BrowserRouter } from "react-router";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider";
import { DiaLogProvider } from "./context/DiaLogProvider";
import { Router } from "./router/Router";

export const App = () => {
  return (
    <AuthProvider>
      <DiaLogProvider>
        <BrowserRouter>
          <Router />
          <Toaster />
        </BrowserRouter>
      </DiaLogProvider>
    </AuthProvider>
  );
};
