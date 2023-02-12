import { LazyLog } from "react-lazylog";

const baseUrl = "http://localhost:3001/fs/path";

/**
 * This is the main Log file viewer component, it's fairly lightweight since react-lazylog
 * handles most of the heavylifting.
 * @param viewerPath the url path to the log file
 * @returns a simple log file viewer
 */
function LogViewer({ viewerPath }) {
  // LazyLog handles fetching the logfile, so we don't need to worry about parsing the blob data
  return (
    <div
      style={{
        height: "calc(100vh - 90px)",
        marginRight: "30px",
        marginLeft: "20px",
      }}
    >
      <LazyLog url={baseUrl + viewerPath} />
    </div>
  );
}

export default LogViewer;
