import React from 'react';
import Editor from "@monaco-editor/react";
import { Box, useColorModeValue } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { editorStateSelector } from '../atoms';


const MainEditor = () => {
    const [value, setValue] = useRecoilState(editorStateSelector)
    const monacoTheme = useColorModeValue("light", "vs-dark")

    return <>
        <Editor
            height="95vh"
            lineNumbers="off"
            language={"markdown"}
            loading={<Box>Loading...</Box>}
            theme={monacoTheme}
            // onMount={handleEditorMount}
            value={value}
            onChange={(e) => setValue(e)}
        />
    </>
}

export default MainEditor;