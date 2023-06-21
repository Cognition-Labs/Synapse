import { useRecoilState } from "recoil";
import { appTitleAtom } from "../atoms";
import { Box, Text } from "@chakra-ui/react";

const TitleBar = () => {
    const [appTitle, setAppTitle] = useRecoilState(appTitleAtom);
    return (
        <>
            <Text bgColor={"black"} fontSize="md" fontWeight="semibold" textAlign="center" pt={1} pb={2} m={0} style={{ "WebkitAppRegion": "drag" }}>
                {appTitle}
            </Text >
        </>
    )
}

export default TitleBar;