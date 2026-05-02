import { BrowserRouter } from "react-router";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider";
import { Router } from "./router/Router";

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
};
