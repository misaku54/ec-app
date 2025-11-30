import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
  globalCss: {
    body: {
      backgroundColor: "gray.100",
      color: "gray.800"
    }
  }
});

export default theme;