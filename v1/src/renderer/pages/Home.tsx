import React from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { Editor } from 'renderer/components/Editor';

const Home: React.FC = () => {
  return (
    <Grid
      templateAreas={'"editor recbar"'}
      gridTemplateRows={'1fr'}
      gridTemplateColumns={'3fr 1fr'}
      h="100vh"
      pt="50px"
      gap="1"
      fontWeight="bold"
    >
      <GridItem p={3} bg="blackAlpha.700" area={'editor'}>
        <Editor />
      </GridItem>
      <GridItem p={3} bg="pink.300" area={'recbar'}>
        <Box />
      </GridItem>
    </Grid>
  );
};

export default Home;
