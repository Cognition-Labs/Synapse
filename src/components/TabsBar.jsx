const { Flex, Box, Text } = require("@chakra-ui/react")


const TabsBar = () => {
    return (
        <Flex gap={0} bgColor={"#111"} fontSize={"md"} w="100%" h="100%" overflowX={"auto"} maxWidth={"50vw"} >
            {/* mapp all tabs over below html */}
            <Box as="button" bgColor={"#1e1e1e"} fontWeight={"light"} h="100%" px={4} pt={1} verticalAlign={"bottom"} width="fit-content" _hover={{ bgColor: "#2e2e2e" }} borderRight={"1px solid #888"}>
                <Text as="u">changelog.txt</Text>
            </Box>
            <Box as="button" bgColor={"#151515"} fontWeight={"light"} h="100%" px={4} pt={1} verticalAlign={"bottom"} width="fit-content" _hover={{ bgColor: "#2e2e2e" }} borderRight={"1px solid #888"}>
                changelog.txt
            </Box>
            <Box as="button" bgColor={"#151515"} fontWeight={"light"} h="100%" px={4} pt={1} verticalAlign={"bottom"} width="fit-content" _hover={{ bgColor: "#2e2e2e" }}>
                changelog.txt
            </Box>
        </Flex>
    )
}

export default TabsBar;