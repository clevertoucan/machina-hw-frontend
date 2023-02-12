import { useEffect, useState } from "react";
import CSVViewer from "./components/CSVViewer";
import JSONViewer from "./components/JSONViewer";
import LogViewer from "./components/LogViewer";

const baseUrl = "http://localhost:3001/fs/path";

/**
 * This is the parent component for all of the document viewer components, it handles fetching
 * files from the backend and routing the file data to the correct viewer component
 * @param fileInfo stores the filename and the path for the currently selected file
 * @returns a file viewer component with the file displayed in the panel, if the file is supported
 */
function FileViewer({ fileInfo }) {
  // stores the file data as a blob
  const [viewerData, setViewerData] = useState();
  // keeps track of wehether or not the file is ready to be displayed
  const [isLoading, setIsLoading] = useState(true);
  // used to route the file to the correct component, will be "csv", "log", or "json"
  const [currentViewer, setCurrentViewer] = useState(null);
  // used to download the current file
  const [downloadLink, setDownloadLink] = useState(null);

  // the path to the current file
  const viewerPath = fileInfo?.path;
  // the name of the current file
  const filename = fileInfo?.filename;

  // whenever the filepath changes, we pull down the new file from the backend
  // and convert it to a blob
  useEffect(() => {
    if (viewerPath) {
      setIsLoading(true);
      fetch(baseUrl + viewerPath)
        .then((response) => response.blob())
        .then((blob) => {
          setViewerData(blob);
        });
      // The log viewer class handles pulling down the file data, so we can route
      // to the log viewer early
      if (viewerPath.endsWith(".log")) {
        setIsLoading(false);
        setCurrentViewer("log");
      }
    }
  }, [viewerPath]);

  // When the file data is ready, we need to route it to the correct file viewer
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
      // generates a download link from the file data blob
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
