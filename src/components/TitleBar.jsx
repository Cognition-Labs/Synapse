import { useRecoilState } from "recoil";
import { appTitleAtom } from "../atoms";
import { Box, Text } from "@chakra-ui/react";

const TitleBar = () => {
    const [appTitle, setAppTitle] = useRecoilState(appTitleAtom);
    return (
        <>
            <Text fontSize="md" fontWeight="semibold" textAlign="center" py={2} m={0} style={{ "-webkit-app-region": "drag" }}>
                {appTitle}
            </Text>
        </>
    )
}

export default TitleBar;