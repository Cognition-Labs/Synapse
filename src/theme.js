import { mode } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: (props) => ({
      body: {
        bg: mode("#fff", "#111")(props),
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
