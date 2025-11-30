import { Button, ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { BrowserRouter } from "react-router";

import theme from "./theme/theme";
import { Router2 } from "./router/Router2";

export const App2 = () => {
  return (
    <ChakraProvider value={theme}>
      <BrowserRouter>
        <Router2 />
      </BrowserRouter>
    </ChakraProvider>
  )
}