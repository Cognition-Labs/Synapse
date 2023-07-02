import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { zoteroQueryAtom } from "../atoms";
import { Box, Button, Collapse, VStack, Text, Divider } from "@chakra-ui/react";

function SuggestionsBar() {
  const zoteroQuery = useRecoilValue(zoteroQueryAtom);
  const [documents, setDocuments] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showSource, setShowSource] = useState({});

  async function fetchModifiedQuery() {
    if (!zoteroQuery || zoteroQuery.trim() === "") {
      setIsFetching(false);
      return;
    }
    setIsFetching(true);
    const response = await fetch(
      `https://degtrdg--synapse-run-query.modal.run/?query=` +
      zoteroQuery +
      "&db_name=daniel",
      { method: "GET" }
    );
    if (!response.ok) {
      setIsFetching(false);
      return;
    }
    const text = await response.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      setIsFetching(false);
      return;
    }
    setDocuments(parsed);
    setIsFetching(false);
  }

  const handleButtonClick = () => {
    if (isFetching) {
      console.log("already fetching");
      return;
    }
    console.log("fetching");
    fetchModifiedQuery();
  }

  const handleToggle = (index) => {
    setShowSource((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <VStack
      align="start"
      overflowY="scroll"
      // width="400px"
      height="100vh"
      p={5}
      spacing={5}
      border="1px"
      borderColor="gray.200"
    >
      <Button onClick={handleButtonClick}>Get Insights!</Button>
      {documents.length > 0 ? (
        documents.map((doc, index) => (
          <Box key={index} w="100%">
            <Text>{doc.page_content}</Text>
            <Button size="sm" onClick={() => handleToggle(index)} mt={2}>
              {showSource[index] ? "Hide Source" : "Show Source"}
            </Button>
            <Collapse in={showSource[index]}>
              <Text fontSize="sm" color="gray.600" mt={2}>
                {doc.metadata.source}
              </Text>
            </Collapse>
            <Text fontSize="sm" color="gray.600" mt={2}>
              Page: {doc.metadata.page}
            </Text>
            <Divider mt={4} />
          </Box>
        ))
      ) : (
        <Box>Loading...</Box>
      )}
    </VStack>
  );
}

export default SuggestionsBar;
