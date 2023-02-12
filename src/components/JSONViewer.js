import ReactJSON from "react-json-view";
import { useEffect, useState } from "react";

function JSONViewer({ viewerData }) {
  const [jsonData, setJSONData] = useState({});

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
