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
        let selectionText = selectionState.selectionText
        if (selectionText.length > 0) {
            setZoteroQuery(selectionText)
            console.log(selectionText)
            let lineSpan = selectionText.split('\n').length - 1
            return;
        }

        // 1. get cursor line number
        let cursorLine = selectionState.cursorPosition.line

        // 2. get text of cursor line
        let lines = value.split("\n")

        // 3. going down, split lines into paragraphs
        let currPar = ""
        let currParLines = []
        for (let i = 0; i < lines.length; i++) {
            currPar += lines[i] + "\n"
            currParLines.push(i + 1)
            if (lines[i].length === 0) {
                if (currParLines.includes(cursorLine)) {
                    break;
                } else {
                    currPar = ""
                    currParLines = []
                    continue;
                }
            }
        }
        setZoteroQuery(currPar)
        console.log(`curr paragraph: ${currPar}`)

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