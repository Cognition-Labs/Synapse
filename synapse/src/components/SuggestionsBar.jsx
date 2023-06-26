import React from "react";
import { useRecoilValue } from "recoil";
import { zoteroQueryAtom } from "../atoms";
import { useEffect, useState } from "react";

function SuggestionsBar() {
  const zoteroQuery = useRecoilValue(zoteroQueryAtom);
  const [modifiedQuery, setModifiedQuery] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (isFetching) return;

    async function fetchModifiedQuery() {
      setIsFetching(true);
      console.log("Fetching modified query");
      const response = await fetch(
        `http://localhost:1200/query?q=${encodeURIComponent(zoteroQuery)}`
      );
      if (!response.ok) {
        console.error("Failed to fetch modified query", response);
        setIsFetching(false);
        return;
      }

      const text = await response.text();
      console.log("text", text);
      const parsed = JSON.parse(text);
      console.log("parsed", parsed);
      // setModifiedQuery(parsed.result.source_documents);
      setModifiedQuery(parsed);
      setIsFetching(false);
    }

    const fetchTimeout = setTimeout(fetchModifiedQuery, 3000); // Waits 6 second before fetching
    return () => clearTimeout(fetchTimeout); // Clears the timeout if the component unmounts
  }, [zoteroQuery, isFetching]);

  return <div>{modifiedQuery}</div>;
}

export default SuggestionsBar;
