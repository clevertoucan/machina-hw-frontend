import { useEffect, useState } from "react";
import CSVViewer from "./components/CSVViewer";
import JSONViewer from "./components/JSONViewer";
import LogViewer from "./components/LogViewer";

const baseUrl = "http://localhost:3001/fs/path";

function FileViewer({ fileInfo }) {
  const [viewerData, setViewerData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [currentViewer, setCurrentViewer] = useState(null);
  const [downloadLink, setDownloadLink] = useState(null);
  const viewerPath = fileInfo?.path;
  const filename = fileInfo?.filename;

  useEffect(() => {
    if (viewerPath) {
      setIsLoading(true);
      fetch(baseUrl + viewerPath)
        .then((response) => response.blob())
        .then((blob) => {
          setViewerData(blob);
        });
      if (viewerPath.endsWith(".log")) {
        setIsLoading(false);
        setCurrentViewer("log");
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
      } else {
        setCurrentViewer(null);
      }
      setDownloadLink(URL.createObjectURL(viewerData));
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
  } else if (isLoading) {
    return <div className="FileViewer-no-file">Loading file...</div>;
  } else {
    return (
      <div className="FileViewer-with-file">
        <div style={{ textAlign: "center" }}>
          <h2>{viewerPath}</h2>
          <a className="DownloadButton" href={downloadLink} download={filename}>
            Download File
          </a>
        </div>
        {currentViewer === "csv" && (
          <div style={{ textAlign: "center" }}>
            <CSVViewer viewerData={viewerData} />
          </div>
        )}
        {currentViewer === "json" && <JSONViewer viewerData={viewerData} />}
        {currentViewer === "log" && <LogViewer viewerPath={viewerPath} />}
        {currentViewer === null && (
          <div style={{ textAlign: "center" }}>Unsupported File Type</div>
        )}
      </div>
    );
  }
}

export default FileViewer;
