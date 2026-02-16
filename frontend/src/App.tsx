import { BrowserRouter } from "react-router";

import { Router } from "./router/Router";

export const App = () => {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}