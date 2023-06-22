/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import { Route, MemoryRouter as Router, Routes } from "react-router-dom";
import { useColorMode } from "@chakra-ui/color-mode";
import theme from "./theme";

function App() {
  const { colorMode, setColorMode } = useColorMode();

  useEffect(() => {
    console.log("Setting initial color mode to", theme.initialColorMode, "from", colorMode, "color mode.")
    setColorMode(theme.initialColorMode);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
