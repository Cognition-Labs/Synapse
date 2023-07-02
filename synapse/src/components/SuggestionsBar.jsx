import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { zoteroQueryAtom } from "../atoms";

function SuggestionsBar() {
  const zoteroQuery = useRecoilValue(zoteroQueryAtom);
  const [modifiedQuery, setModifiedQuery] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isFetching) return;

    async function fetchModifiedQuery() {
      setIsFetching(true);
      console.log("Fetching modified query");

      const response = await fetch(`https://degtrdg--synapse-run-query-dev.modal.run/?query=` + zoteroQuery + "&db_name=daniel", {
        method: "GET",
      });


      console.log("Received response from server", response);
      if (!response.ok) {
        console.error("Failed to fetch modified query", response);
        setIsFetching(false);
        return;
      }

      const text = await response.text();
      console.log("text", text);
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (error) {
        console.error(`Invalid JSON: ${error.message}`);
        setIsFetching(false);
        return;
      }
      setModifiedQuery(parsed);
      setIsFetching(false);

    }
    const fetchTimeout = setTimeout(fetchModifiedQuery, 3000); // Waits 3 second before fetching
    return () => clearTimeout(fetchTimeout); // Clears the timeout if the component unmounts
  }, [zoteroQuery, isFetching]);

  return (
    <div>
      {modifiedQuery ? (
        <>
          <div>{modifiedQuery.query}</div>
          <div>{modifiedQuery.result}</div>
          {modifiedQuery.source_documents.map((doc, index) => (
            <div key={index}>
              <div>{doc.page_content}</div>
              <div>Source: {doc.metadata.source}</div>
              <div>Page: {doc.metadata.page}</div>
            </div>
          ))}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default SuggestionsBar;
