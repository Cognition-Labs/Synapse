import { useRecoilState, useRecoilValue } from "recoil";
import { tabsAtom, activeTabSelector } from "../atoms";
import Tab from "./Tab";
const { Flex, Box, Text } = require("@chakra-ui/react")


const TabsBar = () => {
    const [tabs, setTabs] = useRecoilState(tabsAtom)
    const activeTab = useRecoilValue(activeTabSelector)

    const handleNewTabClick = () => {
        const newTab = {
            title: `Untitled`,
            content: "",
            active: true
        }
        const newTabs = tabs.map((tab) => {
            return { ...tab, active: false }
        })
        newTabs.push(newTab)
        setTabs(newTabs)
        console.log(`new tab ${newTab.id}: ${newTab.title} created`);
    }

    return (
        <Flex gap={0} bgColor={"#111"} fontSize={"md"} w="100%" h="100%" overflowX={"auto"} maxWidth={"50vw"} >
            {tabs.map((tab, tabID) => {
                return (
                    <Tab key={tabID} id={tabID} title={tab.title} active={activeTab.id === tabID} />
                )
            }
            )}

            {/* add tab icon */}
            <Box as="button" fontWeight={"light"} h="100%" px={4} pt={1} verticalAlign={"bottom"} width="fit-content" _hover={{ bgColor: "#2e2e2e" }} onClick={handleNewTabClick}>
                <Text>+</Text>
            </Box>
        </Flex>
    )
}

export default TabsBar;