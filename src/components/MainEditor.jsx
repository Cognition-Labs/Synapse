import Editor from "@monaco-editor/react";
import { Box, Textarea, useColorModeValue } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { editorStateAtom } from '../atoms';
import 'react-quill/dist/quill.snow.css';


const MainEditor = () => {
    const [value, setValue] = useRecoilState(editorStateAtom)
    const monacoTheme = useColorModeValue("light", "vs-dark")

    return <>
        <Editor
            height="95vh"
            lineNumbers="off"
            language={"markdown"}
            // loading={loadingScreen}
            theme={monacoTheme}
            // onMount={handleEditorMount}
            value={value}
            onChange={(e) => setValue(e)}
        />
    </>
}

export default MainEditor;