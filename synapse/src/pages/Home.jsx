import { Box, Grid, GridItem } from "@chakra-ui/react";
import MainEditor from "../components/MainEditor"
import FileTree from "../components/FileTree"
import TabsBar from "../components/TabsBar"

const Home = () => {
    return (
        <>
            <Grid
                templateAreas={'"panel filetree tabs suggestions" "panel filetree editor suggestions"'}
                gridTemplateRows={'3rem 95fr'}
                gridTemplateColumns={'5fr 20fr 50fr 25fr'}
                h="100%"
                m={0}
                p={0}
                fontWeight="bold">
                <GridItem area={'panel'}>
                    <Box bgColor={"#191919"} w="100%" h="100%" />
                </GridItem>
                <GridItem area={'filetree'}>
                    <FileTree />
                </GridItem>
                <GridItem area={'tabs'}>
                    <TabsBar />
                </GridItem>
                <GridItem area={'editor'} maxWidth={"50vw"}>
                    <MainEditor />
                </GridItem>
                <GridItem area={'suggestions'}>
                    <Box w={"100%"} h={"100%"} bgColor={"#888"} />
                </GridItem>
            </Grid >
        </>
    );
}

export default Home;