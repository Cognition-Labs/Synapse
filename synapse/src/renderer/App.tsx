import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { NAV_ITEMS } from './constants';
import theme from './theme';

const App: React.FC = () => (
  <>
    <ColorModeScript initialColorMode="dark" />
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Router>
          <Navbar navItems={NAV_ITEMS} loading={false} />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home/>
                </>
              }
            />
          </Routes>
        </Router>
      </RecoilRoot>
    </ChakraProvider>
  </>
);

export default App;
