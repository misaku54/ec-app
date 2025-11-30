import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
  globalCss: {
    body: {
      backgroundColor: "{colors.gray.100}",  // ← 波括弧で囲む
      color: "{colors.gray.800}"
    }
  }
});

export default theme;