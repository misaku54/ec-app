import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router";

import { Toaster } from "./components/ui/toaster";
import { Router2 } from "./router/Router2";
import theme from "./theme/theme";

export const App2 = () => {
  return (
    <ChakraProvider value={theme}>
      <Toaster />
      <BrowserRouter>
        <Router2 />
      </BrowserRouter>
    </ChakraProvider>
  )
}