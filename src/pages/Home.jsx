import { Box, Grid, GridItem } from "@chakra-ui/react";

const Home = () => {
    return (
        <>
            <Grid
                templateAreas={'"folderbar editor suggestionbar"'}
                gridTemplateRows={'1fr'}
                gridTemplateColumns={'1fr 4fr 2fr'}
                h="100vh"
                gap="1"
                fontWeight="bold">
                <GridItem p={3} bg="blackAlpha.700" area={'folderbar'}>
                    <Box></Box>
                </GridItem>
                <GridItem p={3} bg="green.900" area={'editor'}>
                    <Box />
                </GridItem>
                <GridItem p={3} bg="pink.300" area={'suggestionbar'}>
                    <Box />
                </GridItem>
            </Grid>
        </>
    );
}

export default Home;