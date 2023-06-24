import { Box, Text, HStack } from "@chakra-ui/react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { activeTabSelector, tabsAtom } from "../atoms";
import { AiOutlineClose } from "react-icons/ai";

const Tab = ({ title, id, active }) => {
    const [activeTab, setActiveTab] = useRecoilState(activeTabSelector)
    const setTabs = useSetRecoilState(tabsAtom)

    const handleTabClick = () => {
        console.log(`clicked tab ${id}: ${title}`);
        if (activeTab.id !== id) {
            setActiveTab(id)
            console.log(`switched to tab ${id}: ${title}`);
        }
    }

    const handleCloseTab = (e) => {
        e.stopPropagation();
        let tabsAfterDelete = []
        setTabs((oldTabs) => {
            if (oldTabs.length === 1) {
                console.log("cannot close last tab");
                return oldTabs
            }
            console.log(`closing tab ${id}: ${title}`);
            const newTabs = oldTabs.filter((tab, tabID) => tabID !== id)
            tabsAfterDelete = newTabs
            return newTabs
        })
        if (activeTab.id === id && tabsAfterDelete.length > 0) {
            setActiveTab(tabsAfterDelete[0].id)
        }
    }

    return (
        <Box id={id} as="button" bgColor={"#1e1e1e"}
            fontWeight={active ? "normal" : "light"} h="100%" px={4} pt={1}
            verticalAlign={"bottom"} width="fit-content"
            _hover={{ bgColor: "#2e2e2e" }} borderRight={"1px solid #888"}
            onClick={handleTabClick}>
            <HStack w="100%">
                <Text as={active ? "u" : ""}>{title}</Text>
                <Box>
                    <Box color={"#888"} p={1} _hover={{ border: "1px dashed #cff5f5" }} onClick={handleCloseTab}>
                        <AiOutlineClose />
                    </Box>
                </Box>
            </HStack >
        </Box >
    )
}

export default Tab;