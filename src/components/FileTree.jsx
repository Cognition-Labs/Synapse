import { Box, Text, VStack } from "@chakra-ui/react";
import TreeUI from "./monaco-tree/TreeUI";
import { Tree } from "./monaco-tree";
import { useRecoilValue } from "recoil";
import { directoryListingAtom, rootDirNameAtom } from "../atoms";

const FileTree = () => {
    const dirListing = useRecoilValue(directoryListingAtom)
    const rootDirName = useRecoilValue(rootDirNameAtom)
    return (<>
        <VStack h="99%" w="100%" gap={0} fontFamily={"menlo"} fontWeight={"normal"}>
            <Box bgColor={"#191919"} fontSize={"xl"} w={"100%"} h={"3rem"} pt={4} px={4}>
                < Text fontWeight="bold">{rootDirName}/</Text>
            </Box>
            <Box bgColor={"#191919"} fontSize={"sm"} w={"100%"} h={"calc(100% - 3rem)"} pt={1}>
                <TreeUI dirListing={dirListing} />
            </Box>
        </VStack >
    </>
    )
}


export default FileTree;