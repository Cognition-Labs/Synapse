import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Box, Textarea, useColorModeValue } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import {
  editorStateSelector,
  selectionStateAtom,
  tabsAtom,
  zoteroQueryAtom,
} from "../atoms";

const MainEditor = () => {
  const [value, setValue] = useRecoilState(editorStateSelector);
  const [zoteroQuery, setZoteroQuery] = useRecoilState(zoteroQueryAtom);


  // parse selectionState, update zoteroQuery based on current paragraph or user selection
  useEffect(() => {
    const lastparr = value.split("\n\n")[value.split("\n\n").length - 1];
    setZoteroQuery(lastparr);
    console.log(`curr paragraph: ${lastparr}`);
  }, [value, setZoteroQuery]);

  return (
    <>
      <Textarea
        height="95vh"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

export default MainEditor;
