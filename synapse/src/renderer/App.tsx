import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Box, ChakraProvider } from '@chakra-ui/react';
import { RecoilRoot } from 'recoil';

const App: React.FC = () => (
  <ChakraProvider>
    <RecoilRoot>
      <Router>
        <Routes>
          <Route path="/" element={<><Box>hi</Box></>} />
        </Routes>
      </Router>
    </RecoilRoot>
  </ChakraProvider>

);

export default App;
