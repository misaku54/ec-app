import { Button, ChakraProvider, defaultSystem } from "@chakra-ui/react";
import theme from "./theme/theme";
export const App2 = () => {
  return (
    <ChakraProvider value={theme}>
      <Button colorPalette="teal">ボタン</Button>
      <p>ああああ</p>
    </ChakraProvider>
  )
}