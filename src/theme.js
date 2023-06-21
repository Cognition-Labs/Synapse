import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: mode("#ddd", "blackAlpha.700")(props),
      },
    }),
  },
  config: {
    disableTransitionOnChange: false,
  },
  initialColorMode: "dark",
  useSystemColorMode: false,
});

export default theme;
