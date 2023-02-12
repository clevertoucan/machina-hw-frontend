import { useEffect, useState } from "react";
import CSVViewer from "./components/CSVViewer";
import axiosInstance from "./axios-config";
import JSONViewer from "./components/JSONViewer";
import LogViewer from "./components/LogViewer";

function FileViewer({ viewerPath }) {
  const [viewerData, setViewerData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [currentViewer, setCurrentViewer] = useState(null);

  useEffect(() => {
    if (viewerPath) {
      setIsLoading(true);
      if (viewerPath.endsWith(".log")) {
        setIsLoading(false);
        setCurrentViewer("log");
      } else {
        axiosInstance.get("/fs/path" + viewerPath).then((response) => {
          setViewerData(response.data);
        });
      }
    }
  }, [viewerPath]);

  useEffect(() => {
    if (viewerData) {
      setIsLoading(false);
      if (viewerPath.endsWith(".csv")) {
        setCurrentViewer("csv");
      } else if (viewerPath.endsWith(".json")) {
        setCurrentViewer("json");
      } else if (viewerPath.endsWith(".log")) {
        setCurrentViewer("log");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerData]);

  if (!viewerPath) {
    return (
      <>
        <div className="FileViewer-no-file">
          Select a file from the sidebar to inspect it
        </div>
      </>
    );
  } else if (isLoading || !currentViewer) {
    return <div className="FileViewer-no-file">Loading file...</div>;
  } else if (currentViewer === "csv") {
    return (
      <div className="FileViewer-csv-file">
        <h2>{viewerPath}</h2>
        <CSVViewer viewerData={viewerData} />
      </div>
    );
  } else if (currentViewer === "json") {
    return (
      <div className="FileViewer-json-file">
        <div style={{ textAlign: "center" }}>
          <h2>{viewerPath}</h2>
        </div>
        <JSONViewer viewerData={viewerData} />
      </div>
    );
  } else if (currentViewer === "log") {
    return (
      <div className="FileViewer-log-file">
        <div style={{ textAlign: "center" }}>
          <h2>{viewerPath}</h2>
        </div>
        <LogViewer viewerPath={viewerPath} />
      </div>
    );
  }
}

export default FileViewer;
