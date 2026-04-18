import { BrowserRouter } from "react-router";

import { AuthProvider } from "./context/AuthProvider";
import { Router } from "./router/Router";

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
};
