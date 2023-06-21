import { Box, Grid, GridItem } from "@chakra-ui/react";
import MainEditor from "../components/MainEditor"
import FileTree from "../components/FileTree"

const Home = () => {
    return (
        <>
            <Grid
                templateAreas={'"panel folderbar editor suggestionbar"'}
                gridTemplateRows={'1fr'}
                gridTemplateColumns={'5fr 20fr 50fr 25fr'}
                h="100%"
                m={0}
                p={0}
                fontWeight="bold">
                <GridItem area={'folderbar'}>
                    <FileTree />
                </GridItem>
                <GridItem area={'editor'}>
                    <MainEditor />
                </GridItem>
                <GridItem area={'suggestionbar'}>
                    <Box />
                </GridItem>
            </Grid>
        </>
    );
}

export default Home;