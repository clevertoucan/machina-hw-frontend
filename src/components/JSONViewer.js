import ReactJSON from "react-json-view";
import { useEffect, useState } from "react";

/**
 * This is the main JSON file viewer component, it's fairly lightweight since react-json-view
 * handles most of the heavylifting
 * @param viewerData a blob with the JSON data
 * @returns a simple JSON file viewer
 */
function JSONViewer({ viewerData }) {
  // stores the parsed json object
  const [jsonData, setJSONData] = useState({});

  // We need to parse the JSON from the blob before passing it to the ReactJSON component
  useEffect(() => {
    viewerData.text().then((data) => setJSONData(JSON.parse(data)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerData]);

  return (
    <div
      style={{
        marginRight: "20px",
        marginLeft: "20px",
        height: "calc(100vh - 90px)",
        overflowY: "scroll",
        fontSize: "16px",
      }}
    >
      <ReactJSON src={jsonData} collapsed={1} displayDataTypes={false} />
    </div>
  );
}

export default JSONViewer;
