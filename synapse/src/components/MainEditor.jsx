import React, { useEffect, useRef } from 'react';
import Editor from "@monaco-editor/react";
import { Box, useColorModeValue } from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { editorStateSelector, selectionStateAtom, tabsAtom, zoteroQueryAtom } from '../atoms';


const MainEditor = () => {
    const [value, setValue] = useRecoilState(editorStateSelector)
    const [selectionState, setSelectionState] = useRecoilState(selectionStateAtom)
    const [zoteroQuery, setZoteroQuery] = useRecoilState(zoteroQueryAtom)
    const monacoTheme = useColorModeValue("light", "vs-dark")
    const monacoRef = useRef(null);

    const handleEditorMount = (editor, monaco) => {
        monacoRef.current = editor;
    }

    const handleEditorChange = (e) => {
        setValue(e)
    }

    useEffect(() => {
        setInterval(() => {
            if (monacoRef.current === null) return;
            let selection = monacoRef.current.getSelection()
            let selectionText = monacoRef.current.getModel().getValueInRange(selection)
            let cursorPosition = monacoRef.current.getPosition()
            setSelectionState({ selectionText: selectionText, cursorPosition: { line: cursorPosition.lineNumber, column: cursorPosition.column } })
        }, 1000)
    }, [setSelectionState])


    // parse selectionState, update zoteroQuery based on current paragraph or user selection
    useEffect(() => {
        if (selectionState.selectionText.length > 0) {
            setZoteroQuery(selectionState.selectionText)
            console.log(selectionState.selectionText)
            return;
        }

        // 1. get cursor line number
        let cursorLine = selectionState.cursorPosition.line

        // 2. split text into paragraphs, map line number to paragraph number
        let lines = value.split("\n")

    }, [selectionState, value, setZoteroQuery])



    return <>
        <Editor
            height="95vh"
            lineNumbers="off"
            language={"markdown"}
            loading={<Box>Loading...</Box>}
            theme={monacoTheme}
            onMount={handleEditorMount}
            value={value}
            onChange={handleEditorChange}
        />
    </>
}

export default MainEditor;